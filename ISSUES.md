# Issues

## Improvements

- [!] [I001] (P1) {I009@https://github.com/MarcoPoloResearchLab/mpr-ui} Adopt the current shared footer menu.
  Goal: Preserve the public page with the current shared library.
  Requirements: Replace the obsolete menu attribute. Preserve navigation, themes, images, and layout.
  Deliverables: Prepare the source change, browser checks, and a pull request.
  Validation: Baseline and final `make ci` passed. Both browser checks reproduced the absent menu, then passed after migration.
  Final candidate: `make ci` passed with both browser checks against digest-verified B069 revision `768f25936497c5aabd426197d21c2100b6e5d9a1`.
  Blocked: mpr-ui I009 controls shared publication and coordinated cache acceptance. The owner controls production activation.
