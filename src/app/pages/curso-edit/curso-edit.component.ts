import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService, } from '../../services/curso.service';
import { Curso } from '../../models/curso.model';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-curso-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './curso-edit.component.html',
  styleUrl: './curso-edit.component.css'
})
export class CursoEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cursoService = inject(CursoService);
  private logger = inject(LoggerService);

  id = 0;
  nomeCurso = '';
  descricao = '';
  mensalidade = 0;
  departamentoID = 0;

  ngOnInit() {
    // Pega o ID da URL
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) this.carregarDados();
  }

  carregarDados() {
    this.cursoService.getById(this.id).subscribe({
      next: (curso: Curso) => {
        this.nomeCurso = curso.nomeCurso;
        this.departamentoID = curso.departamentoID ?? 0;
      },
      error: (e: any) => this.logger.error('Erro ao carregar curso', e)
    });
  }

  atualizar() {
    const dadosAtualizados: Curso = {
      cursoID: this.id, // Importante mandar o ID
      nomeCurso: this.nomeCurso,
      departamentoID: this.departamentoID
    };

    this.cursoService.update(this.id, dadosAtualizados).subscribe({
      next: () => {
        alert('Curso atualizado!');
        this.router.navigate(['/cursos']);
      },
      error: (e: any) => {
        this.logger.error('Erro ao atualizar curso', e);
        alert('Erro ao atualizar.');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/cursos']);
  }
}