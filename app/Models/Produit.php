<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/*
 * Produit model — represents a product in the store.
 * Belongs to one category.
 * Can appear in many order details.
 */
class Produit extends Model
{
    protected $table = 'produits';

    protected $fillable = [
        'nom',
        'description',
        'prix',
        'stock',
        'image',
        'categorie_id',
    ];

    // Each product belongs to one category
    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
    }

    // A product can appear in many order detail lines
    public function detailsCommandes()
    {
        return $this->hasMany(DetailCommande::class, 'produit_id');
    }
}
