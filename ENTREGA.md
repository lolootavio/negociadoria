# Negociador IA — Fundação SaaS

## Implementado
- Identidade solicitada, Inter, Lucide, navegação desktop/celular e dashboard sem histórico inventado.
- Login por e-mail/senha, Google e Lovable; cadastro individual/imobiliária, confirmação de e-mail, recuperação, página de nova senha e logout com limpeza de dados em cache.
- Perfis editáveis com nome e telefone; avatar_url preparado no banco, sem upload nesta etapa.
- Criação transacional de organização e vínculo owner no cadastro por e-mail; onboarding idempotente para contas sociais.
- Proteção de páginas privadas e autenticação independente em operações de servidor.
- Equipe com membros reais e alteração de admin/agent pelo owner; configuração de nome da organização para owner/admin.
- Negociações, assistente e propostas são estados de próxima etapa, sem motores simulados.

## Banco e migrations
- `profiles`: UUID ligado ao usuário de autenticação; nome, e-mail, telefone, avatar, datas.
- `organizations`: nome, tipo individual/real_estate_agency, datas.
- `organization_members`: organização, perfil, papel e data; um vínculo por usuário.
- `user_roles`: autoridade protegida de permissões por organização. O papel em members é sincronizado, não editável diretamente.
- `organization_settings`: configuração JSON, moeda BRL e fuso America/Sao_Paulo.
- `drizzle/migrations/0000_saas_foundation.sql`: schema, índices, restrições, RLS, funções e trigger de cadastro.
- `drizzle/migrations/0001_harden_column_grants.sql`: revogação explícita de privilégios herdados e grants limitados por coluna.

## RLS e acesso
- Todas as cinco tabelas têm RLS.
- Organizações, membros e configurações só são lidos pela organização do usuário.
- Perfis são lidos pelo próprio usuário ou por membros do mesmo espaço; edição apenas do próprio perfil.
- Papéis autoritativos só são lidos pelo próprio usuário.
- Configurações e nome da organização só podem ser editados por owner/admin.
- Não há inserção direta de membros ou alteração direta de papéis pelo navegador.
- Funções privilegiadas validam auth.uid(), organização e papel; onboarding usa bloqueio transacional e retorna organização existente.
- Owner não pode remover seu próprio papel nem alterar outro owner. Alterações cruzadas são recusadas.
- Quatro alertas do linter correspondem às funções SECURITY DEFINER intencionalmente acessíveis a autenticados; todas possuem escopo de identidade e search_path fixo.

## Testes realizados
- 8 testes iniciais de permissões e correspondência de rota passaram; teste adicional preserva erros desconhecidos do serviço.
- Teste de integração persistido em `src/test/tenant-security.integration.py`: criação individual/imobiliária, vínculo owner, idempotência, leituras cruzadas bloqueadas nas cinco tabelas, bloqueio de escrita de papéis e de e-mail do perfil, regras owner/admin/agent e login por senha. Passou após endurecer grants.
- Navegador autenticado: organização criada, dashboard real, nome do perfil salvo e relido após atualização, equipe owner, logout e redirecionamento de página privada; nenhum erro de execução.
- Telas desktop 1280×1800 e celular 390×844 verificadas sem largura excedente.
- Cadastro público com domínio reservado foi corretamente rejeitado pelo serviço de e-mail, com erro visível. Não foi enviado e-mail para terceiros ou destinatários inventados de domínio real.

## Pendências e limites de validação
- Confirmação de cadastro via caixa real e recuperação completa até alteração da senha: exigem caixa de teste acessível; não foram verificadas de ponta a ponta.
- Google/Lovable estão habilitados, mas a interação com provedores externos não foi exercitada.
- URLs permitidas de autenticação foram consultadas; preview e URLs de publicação Lovable estão configuradas. Revalidar após domínio próprio/publicação.
- Convites, inclusão/remoção de membros, upload de avatar, pagamentos, motores financeiros, IA e PDF não implementados.
- Armazenamento é fornecido pelo Cloud, mas não há bucket de documentos/avatares nesta etapa.
- LGPD: minimização e acesso isolado implementados; não constitui conformidade jurídica completa. Retenção, exclusão/exportação de conta e textos legais precisam de definição antes da comercialização.

## Problemas encontrados
- Grants herdados permitiam edição do e-mail do perfil. A segunda migration revogou privilégios amplos; o teste de persistência confirmou o bloqueio.
- Teste com domínio example.com foi recusado pelo envio de e-mail gerenciado; não se alterou a exigência de confirmação.

## Próximos passos
1. Validar confirmação/recuperação com e-mail real e revisar os textos legais.
2. Implementar convites seguros e administração completa da equipe.
3. Adicionar motor de negociação com tabelas e RLS por organização.
4. Implementar cálculos e IA somente após testes dos motores reais.

Cloud: banco, contas e operações seguras estão conectados. Documentação: https://docs.lovable.dev/features/cloud