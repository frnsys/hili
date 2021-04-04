(*
    Clip contents of existing selection to a hili server.
    See https://github.com/breezykermo/hili for more info.
*)
on replace_chars(this_text, search_string, replacement_string)
  set AppleScript's text item delimiters to the search_string
  set the item_list to every text item of this_text
  set AppleScript's text item delimiters to the replacement_string
  set this_text to the item_list as string
  set AppleScript's text item delimiters to ""
  return this_text
end replace_chars

tell application id "DNtp"
  try
    set theDoc to the content record of think window 1
    set theRefURL to the reference URL of theDoc as string
    set thePage to ((the current page of think window 1) as string)
    set theUrl to theRefURL & "?page=" & (thePage as string)

    set theCitedText to the (selected text of think window 1 as string)
    if theCitedText is "" then
      (* Scenario 2: Document is open, but no text is highlighted. *)
      set theQuotedText to missing value
    else
      (* Scenario 3: Document is open, text is highlighted. *)
      set theQuotedText to my theCitedText
    end if

    -- set theTags to the tags of theDoc
    set _note to display dialog "note" default answer "" buttons {"Cancel", "Continue"} default button "Continue"
    set _tags to display dialog "tags" default answer "" buttons {"Cancel", "Continue"} default button "Continue"
    set theNote to the text returned of _note
    set theTags to the text returned of _tags
    set theQuote to my replace_chars(theQuotedText, "\\n", "\\\\n")

    do shell script "touch /tmp/args.txt"
    do shell script "echo " & quoted form of theQuote & " > /tmp/args.txt"
    do shell script "echo '*--ENDQUOTE--*' >> /tmp/args.txt"
    do shell script "echo " & quoted form of theNote & " >> /tmp/args.txt"
    do shell script "echo " & quoted form of theTags & " >> /tmp/args.txt"
    do shell script "echo " & quoted form of theUrl & " >> /tmp/args.txt"

    do shell script "cd /Users/lachlankermode/code/pkb/hili/clients/python && python3 clipli.py > /tmp/hili_clip_log.txt"

	on error error_message number error_number
		if the error_number is not -128 then display alert "DEVONthink Pro" message error_message as warning
	end try
end tell
