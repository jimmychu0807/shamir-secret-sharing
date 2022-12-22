#!/usr/bin/env bash

FILE="../src/wordlist.txt"

# wordlist is alphabetically sorted
diff "${FILE}" <(sort "${FILE}") && echo OK

# no word is shorter than 4 letters
diff "${FILE}" <(grep '^....' "${FILE}") && echo OK

# no word is longer than 8 letters
! grep -q '^.........' "${FILE}" && echo OK

# all words have unique 4-letter prefix
diff <(cut -c 1-4 "${FILE}") <(cut -c 1-4 "${FILE}" | sort -u) && echo OK

# wordlist contains only common English words (+ the word "satoshi")
test "$(comm -23 "${FILE}" <(aspell -l en dump master | tr [A-Z] [a-z] | sort ))" = "satoshi" && echo OK
