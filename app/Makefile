.PHONY: help start-server _install-pre-commit

default: help

start-server: ## start fastapi dev server
	uv run fastapi dev

install-pre-commit: ## Install pre-commit
	@if ( which pre-commit > /dev/null 2>&1 ); then \
		pre-commit install --install-hooks; \
	else \
		echo "-----------------------------------------------------------------"; \
		echo "pre-commit is not installed - cannot enable pre-commit hooks!"; \
		echo "Recommendation: Install pre-commit ('brew install pre-commit')."; \
		echo "-----------------------------------------------------------------"; \
	fi

help:
	@echo "usage: make [command]"
	@echo ""
	@echo "Pizza Ops available commands 🚀:"
	@sed -n \
		-e '/^[a-zA-Z0-9_\-]*:.*##/s/:.*##/:/' \
		-e 's/^\(.*\):\(.*\)/$(shell tput setaf 6)\1$(shell tput sgr0): \2/p' \
		$(MAKEFILE_LIST) | column -c2 -t -s :
