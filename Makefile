RELEASE_ARGS ?=
PUBLISH_RELEASE_ARGS ?=
RELEASE_ARTIFACT_TARGETS ?= pages-artifact
override RELEASE_TOOL_DIR := $(abspath $(CURDIR)/scripts/release)
override RELEASE_HELPER := $(RELEASE_TOOL_DIR)/release_helper.py
PAGES_DIST_DIR ?= $(CURDIR)/.pages-dist
PAGES_URL ?= https://likeme.mprlab.com/
PAGES_BRANCH ?= gh-pages
PAGES_VERSION ?=
PAGES_DEPLOY_ARGS ?=

.PHONY: ci test-shared-ui pages-build release-contract-test loopaware-site-id-test release pages-artifact publish-release publish deploy pages-deploy

ci: pages-build release-contract-test loopaware-site-id-test test-shared-ui

pages-build:
	@PAGES_DIST_DIR="$(PAGES_DIST_DIR)" ./scripts/build-pages-artifact.sh

release-contract-test:
	@./tests/release_pages_contract_test.sh

loopaware-site-id-test:
	@./tests/loopaware_site_id_test.sh

release:
	@RELEASE_HELPER="$(RELEASE_HELPER)" RELEASE_ARTIFACT_TARGETS="$(RELEASE_ARTIFACT_TARGETS)" "$(RELEASE_TOOL_DIR)/prepare_release.sh" $(RELEASE_ARGS)

pages-artifact: pages-build
	@"$(RELEASE_TOOL_DIR)/prepare_pages_artifact.sh" --source "$(PAGES_DIST_DIR)" --domain likeme.mprlab.com

publish-release:
	@RELEASE_HELPER="$(RELEASE_HELPER)" "$(RELEASE_TOOL_DIR)/publish_release.sh" $(PUBLISH_RELEASE_ARGS)

publish: publish-release

deploy: pages-deploy

pages-deploy:
	@"$(RELEASE_TOOL_DIR)/deploy_pages_artifact.sh" --branch "$(PAGES_BRANCH)" --url "$(PAGES_URL)" $(if $(PAGES_VERSION),--version "$(PAGES_VERSION)") $(PAGES_DEPLOY_ARGS)

test-shared-ui: pages-build
	cd tests/browser && npx playwright test
