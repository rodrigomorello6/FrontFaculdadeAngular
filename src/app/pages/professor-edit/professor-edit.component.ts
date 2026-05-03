import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProfessorService } from '../../services/professor.service';
import { LoggerService } from '../../services/logger.service';
import { Professor } from '../../models/professor.model';

@Component({
  selector: 'app-professor-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './professor-edit.component.html', 
  styleUrl: './professor-edit.component.css'       
})
export class ProfessorEditComponent implements OnInit {
  private service = inject(ProfessorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);

  id = 0;
  professor: Professor | null = null; 
  
  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.id) {
      this.carregar();
    } else {
      this.cancelar();
    }
  }

  carregar() {
    this.isLoading = true;
    this.service.getById(this.id).subscribe({
      next: (prof) => {
        this.professor = prof;
        this.isLoading = false;
      },
      error: (err) => {
        this.logger.error('Erro ao carregar professor', err);
        this.errorMessage = 'Professor não encontrado.';
        this.isLoading = false;
        // Redireciona após 2s se der erro
        setTimeout(() => this.router.navigate(['/professores']), 2000);
      }
    });
  }

  atualizar() {
    if (!this.professor) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.service.update(this.id, this.professor).subscribe({
      next: () => {
        // Sucesso
        this.router.navigate(['/professores']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao atualizar dados. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/professores']);
  }
}