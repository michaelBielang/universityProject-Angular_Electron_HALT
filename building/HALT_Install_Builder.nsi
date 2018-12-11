/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

; The name of the installer
!define APPNAME "HALT"
name "${APPNAME}"
caption "$(^Name)"
OutFile "Install_HALT.exe"
ShowInstDetails show

; The default installation directory
InstallDir $PROGRAMFILES64\HALT

Var APPICON

; Registry key to check for directory (so if you install again, it will
; overwrite the old one automatically)
InstallDirRegKey HKLM "Software\HALT" "Install_Dir"

; Request application privileges for Windows Vista
RequestExecutionLevel admin


; Dependencies to install
Section "Prerequisites"
  StrCpy $INSTDIR "$PROGRAMFILES64\HALT"
  ZipDLL::extractall "HALT.zip" "$INSTDIR"

  MessageBox MB_YESNO "Install OpenVpn?" IDYES true IDNO false
    true:
      ExecWait "$INSTDIR\resources\app\Prerequisites\openvpn-install-2.4.6-I602.exe"
    false:
      DetailPrint "Does not install OpenVpn."
SectionEnd



; The stuff to install
Section "HALT (required)"
  ; RO = read-only, meaning the user won't be able to change its state
  SectionIn RO

  ; Set output path to the installation directory.
  SetOutPath $INSTDIR

  ; Use this file
  File "HALT_Install_Builder.nsi"

  ; Write the installation path into the registry
  WriteRegStr HKLM SOFTWARE\HALT "Install_Dir" "$INSTDIR"

  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HALT" "HALT" "HALT"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HALT" "Uninstall_HALT" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HALT" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HALT" "NoRepair" 1
  WriteUninstaller "uninstall.exe"

  ; (S-1-5-32-545) = Group Users
  AccessControl::GrantOnFile  "$INSTDIR" "(S-1-5-32-545)" "FullAccess"
SectionEnd



; Optional section (can be disabled by the user)
Section "Create Shortcuts" SecShortCutCreate
  StrCpy $APPICON "\resources\app\Icons\haltv2_icon.ico"
  CreateDirectory "$SMPROGRAMS\HALT"
  CreateShortcut "$SMPROGRAMS\HALT\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR$APPICON" 0
  ; CreateShortcut "$SMPROGRAMS\HALT\HALT_InstallScript.lnk" "$INSTDIR\HALT_InstallScript.nsi" "" "$INSTDIR\building\haltv2_icon.ico" 0
  CreateShortcut "$SMPROGRAMS\HALT\HALT.lnk" "$INSTDIR\HALT.exe" "" "$INSTDIR$APPICON" 0
  CreateShortcut "$DESKTOP\HALT.lnk" "$INSTDIR\HALT.exe" "" "$INSTDIR$APPICON" 0

  MessageBox MB_OK "When used on your own PC (not on office machines of HSA_digit) you should set either the shortcut or the executable to require admin rights."
SectionEnd



; Uninstaller
Section "Uninstall"
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HALT"
  DeleteRegKey HKLM SOFTWARE\HALT
  ; Remove files and uninstaller
  Delete $INSTDIR\HALT_Install_Builder.nsi
  Delete $INSTDIR\uninstall.exe
  ; Remove shortcuts, if any
  Delete "$SMPROGRAMS\HALT\*.*"
  ; Remove directories used
  RMDir "$SMPROGRAMS\HALT"
  RMDir "$INSTDIR"
SectionEnd
