import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AlunoService, } from '../../services/aluno.service';
import { Aluno } from '../../models/aluno.model';
import { LoggerService } from '../../services/logger.service';


@Component({
  selector: 'app-aluno-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './aluno-list.component.html',
  styleUrls: ['./aluno-list.component.css']
})
export class AlunoListComponent implements OnInit {
  private alunoService = inject(AlunoService);
  private router = inject(Router);
  private logger = inject(LoggerService); 

  alunos: Aluno[] = [];
  loading = true;

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.alunoService.getAll().subscribe({
      next: (dados) => {
        this.alunos = dados;
        this.loading = false;
      },
      error: (err) => {
        this.logger.error('Erro ao carregar alunos', err);
        this.loading = false;
      }
    });
  }


  irParaNovo() {
    this.router.navigate(['/alunos/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/alunos/editar', id]);
  }

  deletar(id: number) {
    if(confirm('Deseja excluir este aluno?')) {
      this.alunoService.delete(id).subscribe(() => this.carregar());
    }
  }
}