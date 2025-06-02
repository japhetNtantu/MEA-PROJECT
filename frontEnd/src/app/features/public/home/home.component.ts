import { Component, OnInit } from '@angular/core';
import { PizzaService } from 'src/app/core/pizza.service'; // Ajuste le chemin si nécessaire
import { Pizza } from 'src/app/models/pizza.model'; // Ajuste le chemin si nécessaire
import { HttpErrorResponse } from '@angular/common/http'; // Pour une meilleure gestion des erreurs

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  pizzas: Pizza[] = []; // Tableau pour stocker les pizzas
  isLoading: boolean = true; // Pour gérer l'affichage d'un spinner de chargement
  errorMessage: string | null = null; // Pour afficher les messages d'erreur

  constructor(private pizzaService: PizzaService) { }

  ngOnInit(): void {
    this.loadPizzas(); // Charge les pizzas dès que le composant est initialisé
  }

  /**
   * Charge la liste des pizzas depuis le service API.
   */
  loadPizzas(): void {
    this.isLoading = true; // Active l'indicateur de chargement
    this.errorMessage = null; // Réinitialise le message d'erreur

    this.pizzaService.getPizzas().subscribe({
      next: (data: Pizza[]) => {
        // La requête a réussi
        this.pizzas = data;
        this.isLoading = false; // Désactive l'indicateur de chargement
        console.log('Pizzas chargées avec succès :', this.pizzas);
      },
      error: (error: HttpErrorResponse) => {
        // La requête a échoué
        this.isLoading = false; // Désactive l'indicateur de chargement
        this.errorMessage = 'Erreur lors du chargement des pizzas. Veuillez réessayer plus tard.';
        console.error('Erreur lors de la récupération des pizzas :', error);
        // Tu peux affiner le message d'erreur en fonction du code d'erreur HTTP si tu le souhaites
        // ex: if (error.status === 404) { this.errorMessage = 'Aucune pizza trouvée.'; }
      }
    });
  }

  /**
   * Exemple de méthode pour gérer l'ajout d'une pizza (si le besoin se présente ici).
   * Pourrait rediriger vers une page de détail ou ajouter au panier.
   * @param pizza La pizza sélectionnée.
   */
  onSelectPizza(pizza: Pizza): void {
    console.log('Pizza sélectionnée :', pizza.id);
    // Ici, tu pourrais naviguer vers une page de détail de pizza,
    // ou ajouter la pizza à un panier, etc.
    // this.router.navigate(['/public/pizza', pizza.id]);
  }
}
