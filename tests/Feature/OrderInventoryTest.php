<?php

namespace Tests\Feature;

use App\Models\Categorie;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderInventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_uses_server_prices_and_deducts_aggregated_stock(): void
    {
        $user = $this->user();
        $produit = $this->product(stock: 5, price: 12.50);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', $this->orderPayload([
            ['produit_id' => $produit->id, 'quantite' => 2],
            ['produit_id' => $produit->id, 'quantite' => 2],
        ]));

        $response->assertCreated()
            ->assertJsonPath('total', 50)
            ->assertJsonCount(2, 'details');
        $this->assertSame(1, $produit->fresh()->stock);
    }

    public function test_insufficient_aggregated_stock_does_not_create_an_order_or_change_stock(): void
    {
        $user = $this->user();
        $produit = $this->product(stock: 3);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', $this->orderPayload([
            ['produit_id' => $produit->id, 'quantite' => 2],
            ['produit_id' => $produit->id, 'quantite' => 2],
        ]));

        $response->assertUnprocessable();
        $this->assertDatabaseCount('commandes', 0);
        $this->assertSame(3, $produit->fresh()->stock);
    }

    public function test_cancelling_restores_stock_once_and_reopening_reserves_it_again(): void
    {
        [$admin, $commande, $produit] = $this->orderWithReservedStock();
        Sanctum::actingAs($admin);

        $this->patchJson("/api/orders/{$commande->id}/status", ['statut' => 'annulee'])
            ->assertOk();
        $this->assertSame(5, $produit->fresh()->stock);

        $this->patchJson("/api/orders/{$commande->id}/status", ['statut' => 'annulee'])
            ->assertOk();
        $this->assertSame(5, $produit->fresh()->stock);

        $this->patchJson("/api/orders/{$commande->id}/status", ['statut' => 'validee'])
            ->assertOk();
        $this->assertSame(3, $produit->fresh()->stock);
    }

    public function test_deleting_restores_reserved_stock_but_does_not_double_restore_cancelled_stock(): void
    {
        [$admin, $commande, $produit] = $this->orderWithReservedStock();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/orders/{$commande->id}")->assertOk();
        $this->assertSame(5, $produit->fresh()->stock);

        [$admin, $commande, $produit] = $this->orderWithReservedStock();
        Sanctum::actingAs($admin);
        $this->patchJson("/api/orders/{$commande->id}/status", ['statut' => 'annulee'])
            ->assertOk();
        $this->deleteJson("/api/orders/{$commande->id}")->assertOk();
        $this->assertSame(5, $produit->fresh()->stock);
    }

    private function user(string $role = 'client'): User
    {
        return User::create([
            'nom' => ucfirst($role),
            'email' => $role.'-'.uniqid().'@example.com',
            'mot_de_passe' => bcrypt('password'),
            'role' => $role,
        ]);
    }

    private function product(int $stock = 5, float $price = 10): Produit
    {
        $categorie = Categorie::create(['nom' => 'Test '.uniqid()]);

        return Produit::create([
            'nom' => 'Produit test',
            'prix' => $price,
            'stock' => $stock,
            'categorie_id' => $categorie->id,
        ]);
    }

    private function orderPayload(array $items): array
    {
        return [
            'items' => $items,
            'payment_method' => 'credit_card',
            'delivery_address' => '123 Test Street',
            'delivery_phone' => '+212600000000',
        ];
    }

    private function orderWithReservedStock(): array
    {
        $admin = $this->user('admin');
        $client = $this->user();
        $produit = $this->product();
        $commande = Commande::create([
            'user_id' => $client->id,
            'statut' => 'en_cours',
            'total' => 20,
            'payment_method' => 'credit_card',
            'delivery_address' => '123 Test Street',
            'delivery_phone' => '+212600000000',
            'estimated_delivery_date' => now()->addDays(3),
        ]);
        $commande->details()->create([
            'produit_id' => $produit->id,
            'quantite' => 2,
            'prix_unitaire' => 10,
        ]);
        $produit->decrement('stock', 2);

        return [$admin, $commande, $produit];
    }
}
