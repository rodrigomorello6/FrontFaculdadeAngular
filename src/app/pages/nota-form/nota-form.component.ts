import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// Services
import { NotaService } from '../../services/nota.service';
import { AlunoService } from '../../services/aluno.service';
import { DisciplinaService } from '../../services/disciplina.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-nota-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './nota-form.component.html',
  //styleUrl: './nota-form.component.css'
})
export class NotaFormComponent implements OnInit {
  private notaService = inject(NotaService);
  private alunoService = inject(AlunoService);
  private disciplinaService = inject(DisciplinaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);

  // Listas para os Dropdowns
  listaAlunos: any[] = [];
  listaDisciplinas: any[] = [];

  // Objeto da Nota
  nota: any = {
    notaID: 0,
    alunoID: 0,        // Inicializa zerado para obrigar seleção
    disciplinaID: 0,   // Inicializa zerado
    notaValor: null    // Null para campo vir vazio
  };

  isEditMode = false;
  carregando = true;

  ngOnInit() {
    // 1. Carrega os Dropdowns primeiro
    this.carregarCombos();

    // 2. Verifica se é Edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.carregarNota(Number(id));
    }
  }

  carregarCombos() {
    // Carrega Alunos
    this.alunoService.getAll().subscribe({
      next: (dados) => this.listaAlunos = dados,
      error: (e) => this.logger.error('Erro ao carregar alunos', e)
    });

    // Carrega Disciplinas
    this.disciplinaService.getAll().subscribe({
      next: (dados) => {
        this.listaDisciplinas = dados;
        if (!this.isEditMode) this.carregando = false; // Libera se for Novo
      },
      error: (e) => this.logger.error('Erro ao carregar disciplinas', e)
    });
  }

  carregarNota(id: number) {
    this.notaService.getById(id).subscribe({
      next: (dados) => {
        this.nota = dados;
        this.carregando = false;
      },
      error: () => {
        alert('Erro ao carregar nota.');
        this.router.navigate(['/notas']);
      }
    });
  }

  salvar() {
    // Validação Manual Simples
    if (this.nota.alunoID == 0 || this.nota.disciplinaID == 0) {
      alert('Por favor, selecione o Aluno e a Disciplina.');
      return;
    }
    if (this.nota.notaValor < 0 || this.nota.notaValor > 10) {
      alert('A nota deve ser entre 0 e 10.');
      return;
    }

    if (this.isEditMode) {
      this.notaService.update(this.nota.notaID, this.nota).subscribe({
        next: () => {
          alert('Nota atualizada!');
          this.router.navigate(['/notas']);
        },
        error: (err) => alert('Erro ao atualizar: ' + (err.error?.message || 'Erro desconhecido'))
      });
    } else {
      this.notaService.create(this.nota).subscribe({
        next: () => {
          alert('Nota lançada com sucesso!');
          this.router.navigate(['/notas']);
        },
        error: (err) => {const msg = err.error?.message || 'Erro desconhecido';
      alert('Erro ao lançar: ' + msg);}
      });
    }
  }
}