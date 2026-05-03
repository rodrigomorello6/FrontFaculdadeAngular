import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotaService } from '../../services/nota.service';
import { DisciplinaService} from '../../services/disciplina.service';
import { AlunoService } from '../../services/aluno.service';
import { LoggerService } from '../../services/logger.service';
import { Aluno } from '../../models/aluno.model';
import { Disciplina } from '../../models/disciplina.model';
import { Nota } from '../../models/nota.model';

@Component({
  selector: 'app-nota-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nota-create.component.html',
  styleUrl: './nota-create.component.css'       
})
export class NotaCreateComponent implements OnInit {
  private router = inject(Router);
  private notaService = inject(NotaService);
  private disciplinaService = inject(DisciplinaService);
  private alunoService = inject(AlunoService);
  private logger = inject(LoggerService);

  disciplinas: Disciplina[] = [];
  alunos: Aluno[] = [];

  // Variáveis de Estado
  selectedAlunoID = 0;
  selectedDisciplinaID = 0;
  notaValor: number | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.carregarListas();
  }

  carregarListas() {
    this.isLoading = true;
    
    forkJoin({
      alunos: this.alunoService.getAll(),
      disciplinas: this.disciplinaService.getAll()
    }).subscribe({
      next: (resultado) => {
        this.alunos = resultado.alunos;
        this.disciplinas = resultado.disciplinas;
        this.isLoading = false;
      },
      error: (err) => {
        this.logger.error('Erro ao carregar dados para o formulário de nota', err);
        this.errorMessage = 'Erro ao carregar dados para o formulário.';
        this.isLoading = false;
      }
    });
  }

  salvar() {
    if (!this.selectedAlunoID || !this.selectedDisciplinaID || this.notaValor === null) {
        this.errorMessage = 'Preencha todos os campos corretamente!';
        return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const novaNota: Nota = {
        alunoID: Number(this.selectedAlunoID),
        disciplinaID: Number(this.selectedDisciplinaID),
        notaValor: this.notaValor
    };

    this.notaService.create(novaNota).subscribe({
        next: () => {
            this.router.navigate(['/notas']);
        },
        error: (e: any) => {
            this.logger.error('Erro ao criar nota', e);
            this.errorMessage = 'Erro ao lançar nota. Tente novamente.';
            this.isLoading = false;
        }
    });
  }

  cancelar() { 
    this.router.navigate(['/notas']); 
  }
}