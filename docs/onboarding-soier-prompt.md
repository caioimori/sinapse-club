# Prompt Pronto Pro Caio Mandar Pro Matheus

> Copia o bloco abaixo e manda pro Soier por DM/email. Ele cola na
> primeira sessao Claude Code dele e tudo se configura.

---

```
Soier, sou seu socio no sinapse.club. Ja te dei acesso completo a tudo
(repo, Vercel, Supabase, AbacatePay). Agora bora configurar tua maquina
pra Claude Code operar com mesma capacidade que a minha.

Tarefas pra ti executar agora (cola esse texto no Claude Code que ele
vai te guiar):

1. Confirma se ja tem instalado: Node 20+, Git, GitHub CLI, Claude Code.
   Se faltar algum, instala.

2. Roda no terminal:
   gh auth login

3. Clona o repo:
   cd C:\Users\SEU-USUARIO\Workspace
   git clone https://github.com/caioimori/sinapse-club.git
   cd sinapse-club

4. Configura tua identidade git:
   git config --global user.name "Matheus Soier"
   git config --global user.email "TEU-EMAIL"

5. Pede pro Caio te mandar o arquivo .env.local pelo canal seguro
   (NUNCA por texto). Coloca na raiz do repo.

6. Aceita os convites no email:
   - GitHub (caioimori/sinapse-club)
   - Vercel (sinapse-club)
   - Supabase (organizacao do sinapse)
   - AbacatePay (Caio passa login da conta compartilhada)

7. Roda: npm install && npm run dev
   Confirma que abre http://localhost:3000

8. Dentro do Claude Code, digita: /session soier
   (isso registra tua sessao pro terminal-bus)

9. Manda mensagem teste pro Caio: "manda pro caio que terminei o setup"

10. Le o doc completo em docs/onboarding-soier.md pra detalhes.

Se qualquer coisa quebrar: cola o erro no Claude Code e ele resolve.
Voce nao e dev — voce briefa, agente executa.

A regra do nosso repo e: somos iguais, sem hierarquia. Voce pode mergear
PRs sozinho, fazer deploy, mexer em qualquer area. Marca eu como reviewer
quando criar PR mas nao precisa esperar minha aprovacao se for urgente.

Bora.
— Caio
```

---

## Checklist do Caio (acoes manuais que SO eu posso fazer)

- [ ] Confirmar com o Soier qual e o GitHub username dele. 3 candidatos detectados:
  - `Matheussoier` (criado 2023, conta vazia)
  - `Matheus-soier` (criado mais recente, retornado em busca)
  - `soier` (conta antiga 2014 — provavelmente nao e ele)
- [ ] Convidar Soier no **GitHub** como collaborator com role `admin` ou `maintain`
  - URL: https://github.com/caioimori/sinapse-club/settings/access
  - Apos confirmar username, posso fazer via agente: `gh api -X PUT repos/caioimori/sinapse-club/collaborators/USERNAME -f permission=maintain`
- [ ] Convidar Soier no **Vercel** como Member do projeto sinapse-club
  - URL: https://vercel.com/dashboard → Settings → Team → Invite Member
  - Email dele
- [ ] Convidar Soier no **Supabase** como Member da organization
  - URL: https://supabase.com/dashboard → Organization Settings → Team → Invite
  - Email dele, role `Owner` ou `Administrator`
- [ ] AbacatePay: confirmar se vai ser conta compartilhada (login Google) ou se ele cria conta dele e aceita convite. Definir e passar pra ele.
- [ ] Mandar `.env.local` pelo canal seguro (Bitwarden Send, 1Password, ou similar — NAO WhatsApp/email)
- [ ] Configurar branch protection em `main` (atualmente DESPROTEGIDA):
  - Rule: `main`
  - Require pull request before merging: **SIM**
  - Required approvals: **0** (sem review obrigatorio — confianca mutua)
  - Block force push: **SIM**
  - Posso fazer via agente quando voce confirmar
