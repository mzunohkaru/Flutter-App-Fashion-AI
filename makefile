.PHONY: setup run_dev run_dev_fvm build_runner format_fvm
setup:
	fvm flutter clean
	fvm flutter pub get
	fvm flutter pub cache repair
	fvm flutter pub get

run_dev_fvm:
	fvm flutter run --release --dart-define-from-file=dart_defines/dev.json

run_dev:
	flutter run -d chrome

build_runner:
	fvm flutter pub run build_runner build -d

format_fvm:
	dart fix --apply
	dart format .
	fvm flutter analyze .
