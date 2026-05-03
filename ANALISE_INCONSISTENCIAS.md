# Análise de inconsistências e bugs críticos (Passo 1)

- `RegisterComponent.fazerCadastro()` não finaliza o fluxo de UI: em sucesso/erro não atualiza `loading`, `mensagem`, `sucesso`, nem redireciona/limpa formulário (botão pode ficar travado e usuário sem feedback). Ajustar bloco `subscribe` completo.
- `RegisterComponent` importa `RegisterRequest` de `models/register-request.ts`, enquanto `AuthService` usa `RegisterRequest` de `models/auth.models.ts`; padronizar para **um único DTO** para evitar divergência de contrato.
- `MainLayoutComponent.sair()` chama `authService.logout()` (que já navega para `/login`) e depois navega novamente; remover navegação duplicada para evitar chamadas redundantes.
- `authGuard` usa `router.navigate()` dentro do guard e retorna `false`; preferir `return router.createUrlTree(['/login'])` para evitar efeitos colaterais e melhorar previsibilidade do roteamento.
- `AuthService.isLoggedIn()` valida apenas existência do token; incluir validação de expiração (`exp`) para impedir acesso com JWT expirado.
- `MainLayoutComponent.isAdmin` decodifica JWT com `atob` sem tratar Base64URL (`-`/`_`); usar normalização Base64URL antes do parse para evitar falha com tokens válidos.
- Há `console.log`/`console.error` em autenticação/guard; substituir por serviço de logging com níveis e remover logs sensíveis em produção.
