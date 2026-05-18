<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin account
        User::create([
            'nom'          => 'Administrateur',
            'email'        => 'admin@ecommerce.com',
            'mot_de_passe' => Hash::make('admin123'),
            'role'         => 'admin',
        ]);

        // Create test client account
        User::create([
            'nom'          => 'Mohamed Amine',
            'email'        => 'client@ecommerce.com',
            'mot_de_passe' => Hash::make('client123'),
            'role'         => 'client',
        ]);

        // Create categories
        $smartphones = Categorie::create(['nom' => 'Smartphones',  'description' => 'Téléphones mobiles et accessoires']);
        $laptops     = Categorie::create(['nom' => 'Laptops',      'description' => 'Ordinateurs portables']);
        $accessoires = Categorie::create(['nom' => 'Accessoires',  'description' => 'Accessoires électroniques']);
        $tablettes   = Categorie::create(['nom' => 'Tablettes',    'description' => 'Tablettes et liseuses']);
        $audio       = Categorie::create(['nom' => 'TV & Audio',   'description' => 'Télévisions et équipements audio']);

        $products = [
            // Smartphones
            ['nom' => 'iPhone 15 Pro Max',    'prix' => 1479.99, 'stock' => 15, 'categorie_id' => $smartphones->id, 'description' => 'Titane. Puce A17 Pro. Super Retina XDR.', 'image' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop'],
            ['nom' => 'Samsung Galaxy S24 Ultra', 'prix' => 1469.99, 'stock' => 12, 'categorie_id' => $smartphones->id, 'description' => 'Galaxy AI. Stylet S Pen inclus.', 'image' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop'],
            ['nom' => 'Google Pixel 8 Pro',   'prix' => 1099.99, 'stock' => 8,  'categorie_id' => $smartphones->id, 'description' => 'L\'IA Google au service de la photo.', 'image' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop'],
            ['nom' => 'Xiaomi 14 Ultra',      'prix' => 1499.99, 'stock' => 5,  'categorie_id' => $smartphones->id, 'description' => 'Photographie Leica de pointe.', 'image' => 'https://images.unsplash.com/photo-1662947995689-8692743db16f?w=800&h=800&fit=crop'],
            
            // Laptops
            ['nom' => 'MacBook Pro 16 M3 Max', 'prix' => 3999.99, 'stock' => 4,  'categorie_id' => $laptops->id,     'description' => 'Puissance extrême pour les pros.', 'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'],
            ['nom' => 'MacBook Air 15 M3',     'prix' => 1599.99, 'stock' => 10, 'categorie_id' => $laptops->id,     'description' => 'Fin, léger et incroyablement rapide.', 'image' => 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop'],
            ['nom' => 'Dell XPS 15',           'prix' => 1899.99, 'stock' => 7,  'categorie_id' => $laptops->id,     'description' => 'Écran OLED, performances premium.', 'image' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop'],
            ['nom' => 'Asus ROG Zephyrus G14', 'prix' => 1699.99, 'stock' => 6,  'categorie_id' => $laptops->id,     'description' => 'Laptop gaming compact ultra-puissant.', 'image' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop'],
            ['nom' => 'Lenovo ThinkPad X1 Carbon', 'prix' => 2199.99, 'stock' => 9,  'categorie_id' => $laptops->id, 'description' => 'L\'ultime PC portable professionnel.', 'image' => 'https://images.unsplash.com/photo-1602524206684-88c0199881b2?w=800&h=800&fit=crop'],
            
            // Accessoires
            ['nom' => 'Apple Watch Series 9',  'prix' => 449.99,  'stock' => 25, 'categorie_id' => $accessoires->id, 'description' => 'La montre connectée réinventée.', 'image' => 'https://images.unsplash.com/photo-1434493789847-2902a52dda5c?w=800&h=800&fit=crop'],
            ['nom' => 'Magic Mouse 2',         'prix' => 85.00,   'stock' => 40, 'categorie_id' => $accessoires->id, 'description' => 'Sans fil et rechargeable.', 'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'],
            ['nom' => 'Logitech MX Master 3S', 'prix' => 129.99,  'stock' => 35, 'categorie_id' => $accessoires->id, 'description' => 'La souris parfaite pour la productivité.', 'image' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c3c9c?w=800&h=800&fit=crop'],
            ['nom' => 'Chargeur Rapide 100W GaN', 'prix' => 59.99, 'stock' => 50, 'categorie_id' => $accessoires->id, 'description' => 'Chargez tous vos appareils simultanément.', 'image' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop'],
            
            // Tablettes
            ['nom' => 'iPad Pro 12.9 M2',      'prix' => 1469.00, 'stock' => 12, 'categorie_id' => $tablettes->id,   'description' => 'L\'expérience iPad ultime.', 'image' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop'],
            ['nom' => 'iPad Air M1',           'prix' => 789.00,  'stock' => 18, 'categorie_id' => $tablettes->id,   'description' => 'La puissance de la puce M1 en couleurs.', 'image' => 'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=800&h=800&fit=crop'],
            ['nom' => 'Galaxy Tab S9 Ultra',   'prix' => 1349.99, 'stock' => 7,  'categorie_id' => $tablettes->id,   'description' => 'Un écran immersif spectaculaire.', 'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=800&fit=crop'],
            
            // TV & Audio
            ['nom' => 'AirPods Max',           'prix' => 579.00,  'stock' => 14, 'categorie_id' => $audio->id,       'description' => 'Son haute fidélité. Design circum-auriculaire.', 'image' => 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&h=800&fit=crop'],
            ['nom' => 'Sony WH-1000XM5',       'prix' => 349.99,  'stock' => 20, 'categorie_id' => $audio->id,       'description' => 'La référence de la réduction de bruit.', 'image' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop'],
            ['nom' => 'Bose QuietComfort Ultra', 'prix' => 449.95, 'stock' => 16, 'categorie_id' => $audio->id,      'description' => 'Audio spatial et immersion totale.', 'image' => 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop'],
            ['nom' => 'LG OLED evo C3 55"',    'prix' => 1499.00, 'stock' => 5,  'categorie_id' => $audio->id,       'description' => 'Des noirs parfaits, un contraste infini.', 'image' => 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=800&fit=crop'],
        ];

        foreach ($products as $product) {
            Produit::create($product);
        }
    }
}
