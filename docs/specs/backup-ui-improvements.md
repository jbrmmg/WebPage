# JBR-693 - Backup UI Improvements

## Backup Component

The backup component performs two jobs;

+ Run a set of specific backup type tasks that are defined in a database, for example backup database or backup specific files to a NAS drive.
+ Copy specific files from a NAS drive to a backup NAS drive, Google Drive and One Drive.  Details of the files are stored in a database, for photo and video type files the meta data is extracted and stored in the database. 

## Current UI

The current UI contains 6 tabs that provide the following:

+ Summary information - shows file counts and the status of copying.
+ View files - a tree view that allows the user to view details of files and thier backups.
+ Actions to approve - in order to prevent unwanted damage to the files, things like deletes need to be approved - this screen shows those actions and allows the user to approve.
+ Import - this is used to import photo files, the system will process the files for import, prevent duplicates, allow files to be ignored, gather meta data and copy file to a specific directory based on date time.
+ Log - view logs from the server.
+ Print - select photos for printing - this view shows what photos have been selected for print and details of the print required.

### Summary information tab

![Summary UI screen shot](./Summary.png)

Simply displays the summary data as a list, if status is not OK then highlighted.

### View Files tab

![Initial Screen](./ViewInitial.png)

Initial view shows the high level directories, currently Documents and Photo

![Photo View Screen](./PhotoView.png)

The photo or video view shows a number of details of the photo/video:

+ Location - shows lat long and a map.
+ Files Size
+ Date
+ MD5 checksum
+ Backups of this file
+ There is a list of the files in the same directory, which can be selected for main display.
+ Photo is displayed small at the beginning and can be increased.
+ An expiry date for the file - used to indicate when a file may be out of date.

If the user clicks on the photo they can specify details of a print - these are sent of to an online retailer for printing.

![Select for Print View](./SelectForPrint.png)

If file is not a photo / video - then display is basically the same but no view of the file is shown.

![Other File View Screen](./OtherView.png)

### Actions to approve

![Actions View](./Action.png)

This is just a list of actions with a confirm button.

### Import

![Imports View](./Import.png)

Controls the import of photos and videos, displays the media and information such as location and size.  A number of steps are involved in the processing and the status is show - it updates as files are updated.  User can choose the directory name, system will then put in that directory below the dated directory.  User can ignore files so they are never imported.

### Logs

![Logs View](./Logs.png)

Displays a list of log file entries from the server.

### Prints

![Prints View](./Print.png)

Displays the photos selected for print with the size requested, user can remove from prints.

## UI improvements

What?