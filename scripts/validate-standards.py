"""Run the external checker with the explicitly requested scoped npm identity."""
import importlib.util
import json
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("standards", sys.argv[1])
standards = importlib.util.module_from_spec(spec)
spec.loader.exec_module(standards)
errors = standards.check_repository(
    root, "lailai0916/ui", initializing="--initializing" in sys.argv,
    display_name="laikit UI",
)
# The upstream check assumes package and repository names match. This public scope is intentional.
if json.loads((root / "package.json").read_text())["name"] == "@lailai0916/ui":
    errors = [e for e in errors if e != "package-identity: replace the template package name"]
else:
    errors.append("package-identity: expected @lailai0916/ui")
if "--github" in sys.argv:
    errors.extend(standards.check_github(root, "lailai0916/ui"))
else:
    print("GitHub metadata not checked; pass --github to verify it.")
for error in errors:
    print(f"ERROR {error}")
print(f"Repository validation: {len(errors)} errors.")
sys.exit(bool(errors))
