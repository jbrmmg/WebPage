# Functionality improvements (JBR-712,JBR-622,JBR-577,JBR-634)

There are a number of features added to the server REST API and i would like to implement UI features for them

## Special Processing for 'browser files' ✅

The File Information that is returned from the server now has a 'browser' boolean - if this is true then the filename should become a hyperlink - clicking it should open the file in a new tab.

## Download option ✅

On the file detail screen there should be an option to download the file, there is a new endpoint on files (similar to image) called download - takes a file id and returns the binary data.

## Print multiple copies ✅

It should be possible to request multiple copies of photos but with different size/type of photo.

## Amend location on photos ✅

There should be a new option to update the location of a file - the endpoint of this is a PUT method on files called location.  It takes a JSON like this - { "id": 1, "latitude": 53.9212, "longitude": -0.2322 }.  I suggest it pops up a dialog and displays a leaflet window - location will be the center - dialog should remember the last location so that updating a few will be easier.

## Amend date time on photos ✅

There should be a new option to update the date/time of a file - the endpoint of this is a PUT on the files called date. It takes a JSON with two properties id and date.

## Wipe the Import data

There should be a button on the import screen - next to the refresh - that resets the data - this is achieved by calling the DELETE backup/import/data followed by the DELETE backup/import/cache.