.PHONY: help

default: help

start-app: ## start django development server
	python3 manage.py runserver

help:
	@echo "usage: make [command]"
	@echo ""
	@echo "Pizza Ops available commands 🚀:"
	@sed \
    		-e '/^[a-zA-Z0-9_\-]*:.*##/!d' \
    		-e 's/:.*##\s*/:/' \
    		-e 's/^\(.\+\):\(.*\)/$(shell tput setaf 6)\1$(shell tput sgr0):\2/' \
    		$(MAKEFILE_LIST) | column -c2 -t -s :