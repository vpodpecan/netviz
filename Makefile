
all: main.min.js main.min.css

main.min.js: main.js
	uglifyjs --compress --mangle -- main.js > main.min.js

main.min.css: main.css
	python -m jsmin main.css > main.min.css



clean:
	rm main.min.js main.min.css
