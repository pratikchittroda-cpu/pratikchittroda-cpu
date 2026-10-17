.PHONY: test

test:
	npm ci --offline --ignore-scripts
	npm test
