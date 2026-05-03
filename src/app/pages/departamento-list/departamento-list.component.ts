import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento.model';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-departamento-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './departamento-list.component.html',
  styleUrl: './departamento-list.component.css'
})
export class DepartamentoListComponent implements OnInit {
  private departamentoService = inject(DepartamentoService);
  private logger = inject(LoggerService);
  
  departamentos: Departamento[] = [];

  ngOnInit() {
    this.carregarDepartamentos();
  }

  carregarDepartamentos() {
    this.departamentoService.getAll().subscribe({
      next: (dados) => this.departamentos = dados,
      error: (err) => this.logger.error('Erro ao carregar departamentos', err)
    });
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir este departamento?')) {
      this.departamentoService.delete(id).subscribe({
        next: () => {
          alert('Departamento excluído!');
          this.carregarDepartamentos(); // Recarrega a lista
        },
        error: (err) => alert('Erro ao excluir: ' + (err.error?.message || 'Erro desconhecido'))
      });
    }
  }
}