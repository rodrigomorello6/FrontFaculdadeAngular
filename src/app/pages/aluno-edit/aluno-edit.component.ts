import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoService } from '../../services/aluno.service';
import { Aluno } from '../../models/aluno.model';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-aluno-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aluno-edit.component.html',
  styleUrl: './aluno-edit.component.css'
})
export class AlunoEditComponent implements OnInit {
  private service = inject(AlunoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);

  id = 0;
  nome = '';
  cpf = '';
  rg = '';
  dataNascimento = '';

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) this.carregarDados();
  }

  carregarDados() {
    this.service.getById(this.id).subscribe({
        next: (aluno) => {
            this.nome = aluno.alunoNome;
            this.cpf = aluno.cpf;
            this.rg = aluno.rg;
            if (aluno.dataNascimento) {
                this.dataNascimento = aluno.dataNascimento.split('T')[0];
            }
        },
        error: (e: any) => this.logger.error('Erro ao carregar aluno', e)
    });
  }

  atualizar() {
    const alunoAtualizado: Aluno = {
        alunoID: this.id,
        alunoNome: this.nome,
        cpf: this.cpf,
        rg: this.rg,
        dataNascimento: this.dataNascimento
    };

    this.service.update(this.id, alunoAtualizado).subscribe({
        next: () => {
            alert('Dados atualizados!');
            this.router.navigate(['/alunos']);
        },
        error: (e: any) => {
            this.logger.error('Erro ao atualizar aluno', e);
            alert('Erro ao atualizar.');
        }
    });
  }

  cancelar() {
    this.router.navigate(['/alunos']);
  }
}