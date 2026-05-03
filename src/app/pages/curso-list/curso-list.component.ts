import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoService,} from '../../services/curso.service';
import { Router } from '@angular/router'; // Adicione Router para navegar para editar
import { Curso } from '../../models/curso.model';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curso-list.component.html',
  styleUrls: ['./curso-list.component.css']
})
export class CursoListComponent implements OnInit {
  private service = inject(CursoService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  cursos: Curso[] = [];
  loading = true;

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.getAll().subscribe({
      next: (d) => { this.cursos = d; this.loading = false; },
      error: (e: any) => { this.logger.error('Erro ao carregar cursos', e); this.loading = false; }
    });
  }

  irParaNovo() {
    this.router.navigate(['/cursos/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/cursos/editar', id]);
  }

  deletar(id: number) {
    if(confirm('Excluir curso?')) {
        this.service.delete(id).subscribe({
            next: () => this.carregar(),
            error: (e: any) => this.logger.error('Erro ao deletar curso', e)
        });
    }
  }
}