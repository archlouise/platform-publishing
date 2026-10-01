@AGENTS.md

# Project conventions
- `PROJECT.md` at the repo root is the project record: what the project is, the decisions made, and a dated work log. After every merged PR, deployment, or decision, add an entry to its work log and update the affected sections. See its section 7.
- Git workflow: commit and push as work progresses; one branch and one squash-merged PR per complete feature.
- Production is https://aec-network.vercel.app, deployed manually with `pnpm dlx vercel --prod --yes` from this folder until GitHub auto-deploy is connected.
