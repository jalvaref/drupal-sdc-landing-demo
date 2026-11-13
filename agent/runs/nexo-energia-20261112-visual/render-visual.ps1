param(
  [string]$RunDir = (Join-Path (Get-Location) 'agent/runs/nexo-energia-20261112-visual'),
  [string]$HeroPath = (Join-Path $env:USERPROFILE '.codex/generated_images/01a1d072-d5d8-7210-bd63-bd9053997282/exec-7d17aaf0-add2-423d-be79-5152bedde309.png')
)

Add-Type -AssemblyName System.Drawing

$navy = [Drawing.ColorTranslator]::FromHtml('#142d65')
$coral = [Drawing.ColorTranslator]::FromHtml('#f0442e')
$ink = [Drawing.ColorTranslator]::FromHtml('#111827')
$muted = [Drawing.ColorTranslator]::FromHtml('#536070')
$soft = [Drawing.ColorTranslator]::FromHtml('#f6f8fb')
$line = [Drawing.ColorTranslator]::FromHtml('#d9dee7')
$white = [Drawing.Color]::White
$paleBlue = [Drawing.ColorTranslator]::FromHtml('#e9f0fa')

function F([int]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular) {
  return New-Object Drawing.Font('Segoe UI', $size, $style)
}
function Ctx([System.Drawing.Graphics]$g) {
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.TextRenderingHint = [Drawing.Text.TextRenderingHint]::ClearTypeGridFit
}
function Fill([System.Drawing.Graphics]$g, $color, [float]$x, [float]$y, [float]$w, [float]$h) {
  $g.FillRectangle((New-Object Drawing.SolidBrush($color)), $x, $y, $w, $h)
}
function Line([System.Drawing.Graphics]$g, $color, [float]$x1, [float]$y1, [float]$x2, [float]$y2, [float]$width = 1) {
  $g.DrawLine((New-Object Drawing.Pen($color, $width)), $x1, $y1, $x2, $y2)
}
function Text([System.Drawing.Graphics]$g, [string]$value, [System.Drawing.Font]$font, $color, [float]$x, [float]$y, [float]$w, [float]$h, [System.Drawing.StringAlignment]$align = [System.Drawing.StringAlignment]::Near) {
  $fmt = New-Object Drawing.StringFormat
  $fmt.Alignment = $align
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Near
  $fmt.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit
  $g.DrawString($value, $font, (New-Object Drawing.SolidBrush($color)), (New-Object Drawing.RectangleF($x, $y, $w, $h)), $fmt)
}
function Round([System.Drawing.Graphics]$g, $fillColor, $borderColor, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r = 16, [float]$borderWidth = 1) {
  $path = New-Object Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90); $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90); $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90); $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90); $path.CloseFigure()
  if ($fillColor) { $g.FillPath((New-Object Drawing.SolidBrush($fillColor)), $path) }
  if ($borderColor) { $g.DrawPath((New-Object Drawing.Pen($borderColor, $borderWidth)), $path) }
}
function Button([System.Drawing.Graphics]$g, [string]$label, [float]$x, [float]$y, [float]$w, [bool]$secondary = $false) {
  Round $g ($(if ($secondary) { $white } else { $coral })) ($(if ($secondary) { $navy } else { $null })) $x $y $w 48 5 2
  Text $g $label (F 15 ([Drawing.FontStyle]::Bold)) ($(if ($secondary) { $navy } else { $white })) $x ($y + 14) $w 24 ([Drawing.StringAlignment]::Center)
}
function Badge([System.Drawing.Graphics]$g, [string]$label, [float]$x, [float]$y, [float]$w, $bg = $coral, $fg = $white) {
  Round $g $bg $null $x $y $w 28 14 0
  Text $g $label (F 11 ([Drawing.FontStyle]::Bold)) $fg $x ($y + 7) $w 17 ([Drawing.StringAlignment]::Center)
}
function DrawHeroImage([System.Drawing.Graphics]$g, [System.Drawing.Image]$img, [float]$x, [float]$y, [float]$w, [float]$h) {
  $ratio = [Math]::Max($w / $img.Width, $h / $img.Height)
  $nw = $img.Width * $ratio; $nh = $img.Height * $ratio
  $sx = $x + (($w - $nw) / 2); $sy = $y + (($h - $nh) / 2)
  $state = $g.Save(); $g.SetClip((New-Object Drawing.RectangleF($x, $y, $w, $h))); $g.DrawImage($img, $sx, $sy, $nw, $nh); $g.Restore($state)
}
function SaveJpeg([System.Drawing.Bitmap]$bmp, [string]$path) {
  $codec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $params = New-Object Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality, [long]94)
  $bmp.Save($path, $codec, $params)
  $bmp.Dispose()
}
function SectionLabel([System.Drawing.Graphics]$g, [string]$label, [float]$x, [float]$y, [float]$w) { Text $g $label.ToUpper() (F 12 ([Drawing.FontStyle]::Bold)) $coral $x $y $w 22 }
function SectionHeading([System.Drawing.Graphics]$g, [string]$title, [string]$desc, [float]$x, [float]$y, [float]$w, [bool]$center = $false) {
  $a = if ($center) { [Drawing.StringAlignment]::Center } else { [Drawing.StringAlignment]::Near }
  Text $g $title (F 29 ([Drawing.FontStyle]::Bold)) $navy $x $y $w 42 $a
  Text $g $desc (F 15) $muted $x ($y + 48) $w 42 $a
}

function RenderDesktop([string]$outPath, [System.Drawing.Image]$hero) {
  $w = 1440; $h = 4460; $bmp = New-Object Drawing.Bitmap($w, $h); $g = [Drawing.Graphics]::FromImage($bmp); Ctx $g; Fill $g $white 0 0 $w $h
  Fill $g $paleBlue 0 0 $w 46; Text $g 'CONCEPTO DE DEMOSTRACIÓN — contenido y condiciones no válidos para publicación' (F 12 ([Drawing.FontStyle]::Bold)) $navy 0 14 $w 20 ([Drawing.StringAlignment]::Center)
  Fill $g $white 0 46 $w 78; Text $g 'nexo energía' (F 27 ([Drawing.FontStyle]::Bold)) $navy 76 67 230 36; Text $g 'Comparar' (F 13 ([Drawing.FontStyle]::Bold)) $navy 905 78 92 22; Text $g 'Cómo funciona' (F 13 ([Drawing.FontStyle]::Bold)) $navy 1016 78 125 22; Button $g 'Hablar con Nexo' 1176 61 184 $false
  Fill $g $soft 0 124 $w 540; Text $g 'NEXO ENERGÍA · HOGAR + MOVILIDAD' (F 13 ([Drawing.FontStyle]::Bold)) $coral 78 186 500 22; Text $g "Una energía que`nse adapta a cómo`nte mueves" (F 42 ([Drawing.FontStyle]::Bold)) $navy 78 225 620 160; Text $g "Coordina el consumo de tu hogar con las necesidades`nde recarga de tu vehículo eléctrico, con una propuesta`nclara y fácil de comparar." (F 19) $muted 78 400 540 74; Button $g 'Quiero hablar con Nexo' 78 505 238 $false; Button $g 'Comparar alternativas' 334 505 218 $true; Round $g $white $null 806 164 540 456 22 0; DrawHeroImage $g $hero 806 164 540 456; Text $g 'Creatividad editorial ficticia' (F 11 ([Drawing.FontStyle]::Bold)) $white 836 582 240 20
  SectionLabel $g 'Una propuesta sencilla' 78 734 300; SectionHeading $g 'La energía de tu casa también puede acompañar tus trayectos' 'Explora una experiencia diseñada para entender, comparar y pedir orientación.' 280 758 880 $true
  Fill $g $white 0 920 $w 286; Round $g $paleBlue $null 78 965 1284 170 18 0; Text $g 'Nexo Energía es un concepto ficticio para explorar cómo una tarifa doméstica, la recarga y una recomendación clara podrían convivir en una misma experiencia.' (F 19) $navy 170 1008 1100 70 ([Drawing.StringAlignment]::Center)
  Fill $g $soft 0 1206 $w 470; SectionHeading $g 'Lo esencial, de un vistazo' 'Tres ventajas ilustrativas antes de comparar las alternativas.' 78 1265 700; $cards = @(@('01','Pensada para tu hogar','Una lectura sencilla del consumo doméstico y la recarga.'), @('02','Fácil de comparar','Criterios visibles para valorar tres alternativas ficticias.'), @('03','Acompañamiento','Una orientación demostrativa antes de hablar con el equipo.')); $x=78; foreach($card in $cards){ Round $g $white $line $x 1380 384 190 16 1; Text $g $card[0] (F 24 ([Drawing.FontStyle]::Bold)) $coral ($x+26) 1404 56 30; Text $g $card[1] (F 18 ([Drawing.FontStyle]::Bold)) $navy ($x+26) 1450 320 28; Text $g $card[2] (F 14) $muted ($x+26) 1491 320 58; $x += 408 }
  Fill $g $navy 0 1676 $w 300; Text $g 'REFERENCIA RÁPIDA' (F 12 ([Drawing.FontStyle]::Bold)) $coral 78 1724 240 20; Text $g 'Cifras de demostración, no métricas reales.' (F 15) $white 78 1752 460 26; $stats = @(@('3','alternativas ficticias'), @('3','preguntas para orientarte'), @('1','conversación siguiente')); $x=660; foreach($s in $stats){ Text $g $s[0] (F 42 ([Drawing.FontStyle]::Bold)) $white $x 1716 110 55; Text $g $s[1] (F 14) $white $x 1772 210 35; $x += 245 }
  Fill $g $white 0 1976 $w 660; SectionLabel $g 'C11 · candidato experimental' 78 2022 350; SectionHeading $g 'Compara las alternativas' 'Precios, condiciones y ventajas ficticios. La marca coral es una orientación, no una recomendación real.' 78 2050 720; Badge $g 'LECTURA SIMULTÁNEA' 1082 2047 250 $coral $white; $tx=78; $ty=2150; $tw=@(250,350,350,350); $labels=@('Criterio','Base hogar','Equilibrio','Flex movilidad'); for($i=0;$i -lt 4;$i++){ $bg=if($i -eq 2){$paleBlue}else{$soft}; Round $g $bg $line $tx $ty $tw[$i] 58 0 1; Text $g $labels[$i] (F 15 ([Drawing.FontStyle]::Bold)) $navy ($tx+18) ($ty+18) ($tw[$i]-36) 24; $tx += $tw[$i] }; Badge $g 'ORIENTACIÓN DEMOSTRATIVA' 708 2212 245 $coral $white; $rows=@(@('Precio orientativo','29,90 €','39,90 €','49,90 €'),@('Tipo de hogar','Cualquier vivienda','Vivienda habitual','Vivienda + segunda plaza'),@('Patrón de recarga','Ocasional','Nocturna habitual','Variable'),@('Ventaja movilidad','Guía básica','Saldo ilustrativo','Más opciones ilustrativas'),@('Condición clave','Sin condición real','Revisión anual ficticia','Flexibilidad ilustrativa')); $yy=2208; foreach($row in $rows){$tx=78;$hh=70;for($i=0;$i -lt 4;$i++){Round $g $(if($i -eq 2){$paleBlue}else{$white}) $line $tx $yy $tw[$i] $hh 0 1; Text $g $row[$i] (F $(if($i -eq 0){13}else{12})) $(if($i -eq 2){$navy}else{$ink}) ($tx+18) ($yy+16) ($tw[$i]-36) 42; $tx += $tw[$i]};$yy += $hh};$tx=328;Button $g 'Ver Base' $tx 2602 170 $false;Button $g 'Elegir Equilibrio' 708 2602 190 $false;Button $g 'Ver Flex' 1090 2602 170 $false; Text $g 'Selecciona una opción para continuar' (F 12) $muted 78 2670 400 20
  Fill $g $soft 0 2736 $w 610; SectionLabel $g 'C12 · candidato experimental' 78 2780 350; SectionHeading $g 'Encuentra una orientación demostrativa' 'Un recorrido guiado con estado, validación básica, navegación y resultado condicionado.' 78 2808 650; Round $g $navy $null 78 2920 410 310 18 0; Text $g 'TU RECORRIDO' (F 12 ([Drawing.FontStyle]::Bold)) $coral 112 2960 200 20; $stepLabels=@('01  Tu vivienda','02  Tu recarga','03  Tu zona');$sy=3008;for($i=0;$i -lt 3;$i++){Round $g $(if($i -eq 0){$coral}else{[Drawing.Color]::FromArgb(60,255,255,255)}) $null 112 $sy 240 46 8 0;Text $g $stepLabels[$i] (F 14 ([Drawing.FontStyle]::Bold)) $(if($i -eq 0){$white}else{$white}) 132 ($sy+14) 210 20;$sy+=62}; Round $g $white $line 540 2920 805 310 18 1; Text $g '1 / 3 · Tu vivienda' (F 13 ([Drawing.FontStyle]::Bold)) $coral 584 2960 220 22; Text $g '¿Qué tipo de vivienda tienes?' (F 22 ([Drawing.FontStyle]::Bold)) $navy 584 3000 470 32; $opts=@('Piso','Casa','Otra vivienda');$ox=584;foreach($o in $opts){Round $g $soft $line $ox 3062 152 50 8 1;Text $g $o (F 14 ([Drawing.FontStyle]::Bold)) $navy $ox 3078 152 22 ([Drawing.StringAlignment]::Center);$ox+=170}; Text $g 'Validación: selecciona una opción para continuar' (F 12) $muted 584 3132 350 20; Button $g 'Siguiente' 1145 3165 150 $false
  Fill $g $white 0 3346 $w 430; SectionLabel $g 'Una escena cotidiana' 78 3394 300; Text $g "Cuando llegar a casa también significa`nestar listo para mañana" (F 31 ([Drawing.FontStyle]::Bold)) $navy 78 3430 520 82; Text $g 'La vivienda, la movilidad y la tranquilidad de tener la propuesta explicada con claridad.' (F 15) $muted 78 3535 490 56; Button $g 'Volver a comparar' 78 3630 205 $true; Round $g $white $null 760 3378 586 320 18 0; DrawHeroImage $g $hero 760 3378 586 320
  Fill $g $soft 0 3776 $w 400; SectionLabel $g 'Después de pedir información' 78 3820 350; SectionHeading $g 'Un proceso fácil de seguir' 'Tres pasos ilustrativos para explicar el siguiente tramo.' 78 3847 610; $steps=@(@('01','Cuéntanos tu situación'),@('02','Revisamos las opciones'),@('03','Decides con contexto'));$x=78;foreach($st in $steps){Text $g $st[0] (F 28 ([Drawing.FontStyle]::Bold)) $coral $x 3955 55 34;Text $g $st[1] (F 16 ([Drawing.FontStyle]::Bold)) $navy $x 4005 330 30;Line $g $line ($x+55) 3974 ($x+345) 3974 2;$x+=408}
  Fill $g $white 0 4176 $w 250; SectionHeading $g 'Preguntas frecuentes' 'Elegibilidad, precio, recarga y condiciones del concepto demostrativo.' 78 4210 640; Text $g '¿Los precios y condiciones son reales?' (F 16 ([Drawing.FontStyle]::Bold)) $navy 830 4220 500 24; Line $g $line 830 4265 1320 4265 1; Text $g 'No. Son ilustrativos y están pendientes de validación.' (F 14) $muted 830 4280 500 24
  Fill $g $navy 0 4426 $w 34; SaveJpeg $bmp $outPath; $g.Dispose()
}

function RenderMobile([string]$outPath, [System.Drawing.Image]$hero) {
  $w=390;$h=6340;$bmp=New-Object Drawing.Bitmap($w,$h);$g=[Drawing.Graphics]::FromImage($bmp);Ctx $g;Fill $g $white 0 0 $w $h
  Fill $g $paleBlue 0 0 $w 58;Text $g 'DEMO · no es una oferta real' (F 11 ([Drawing.FontStyle]::Bold)) $navy 0 20 $w 18 ([Drawing.StringAlignment]::Center);Fill $g $white 0 58 $w 66;Text $g 'nexo' (F 25 ([Drawing.FontStyle]::Bold)) $navy 22 77 90 32;Text $g 'energía' (F 25) $coral 88 77 100 32;Text $g '☰' (F 22 ([Drawing.FontStyle]::Bold)) $navy 342 80 28 28 ([Drawing.StringAlignment]::Center)
  Fill $g $soft 0 124 $w 660;Text $g 'NEXO ENERGÍA · HOGAR + MOVILIDAD' (F 11 ([Drawing.FontStyle]::Bold)) $coral 22 152 340 20;Text $g "Una energía que`nse adapta a cómo`nte mueves" (F 36 ([Drawing.FontStyle]::Bold)) $navy 22 190 340 132;Text $g 'Coordina tu hogar y la recarga de tu vehículo eléctrico con una propuesta clara.' (F 17) $muted 22 347 340 66;Button $g 'Quiero hablar con Nexo' 22 438 346 $false;Button $g 'Comparar alternativas' 22 498 346 $true;Round $g $white $null 22 568 346 190 18 0;DrawHeroImage $g $hero 22 568 346 190;Text $g 'Creatividad editorial ficticia' (F 10 ([Drawing.FontStyle]::Bold)) $white 42 730 220 18
  SectionLabel $g 'Una propuesta sencilla' 22 840 300;Text $g 'La energía de tu casa también puede acompañar tus trayectos' (F 26 ([Drawing.FontStyle]::Bold)) $navy 22 874 346 76;Text $g 'Una experiencia para entender, comparar y pedir orientación.' (F 15) $muted 22 966 346 44;Round $g $paleBlue $null 22 1032 346 122 16 0;Text $g 'Concepto ficticio para explorar la relación entre hogar, recarga y movilidad.' (F 15) $navy 42 1064 306 54 ([Drawing.StringAlignment]::Center)
  Fill $g $soft 0 1200 $w 570;SectionHeading $g 'Lo esencial, de un vistazo' 'Ventajas ilustrativas' 22 1240 346; $y=1350;foreach($card in @(@('01','Pensada para tu hogar'),@('02','Fácil de comparar'),@('03','Acompañamiento'))){Round $g $white $line 22 $y 346 112 14 1;Text $g $card[0] (F 20 ([Drawing.FontStyle]::Bold)) $coral 42 ($y+22) 42 28;Text $g $card[1] (F 17 ([Drawing.FontStyle]::Bold)) $navy 96 ($y+22) 235 26;Text $g 'Beneficio demostrativo para entender mejor la propuesta.' (F 13) $muted 96 ($y+56) 240 36;$y+=128}
  Fill $g $navy 0 1770 $w 270;Text $g 'REFERENCIA RÁPIDA' (F 11 ([Drawing.FontStyle]::Bold)) $coral 22 1808 200 18;Text $g 'Cifras de demostración' (F 14) $white 22 1834 220 22;Text $g '3' (F 34 ([Drawing.FontStyle]::Bold)) $white 22 1883 50 42;Text $g 'alternativas' (F 12) $white 22 1930 110 20;Text $g '3' (F 34 ([Drawing.FontStyle]::Bold)) $white 148 1883 50 42;Text $g 'preguntas' (F 12) $white 148 1930 110 20;Text $g '1' (F 34 ([Drawing.FontStyle]::Bold)) $white 278 1883 50 42;Text $g 'conversación' (F 12) $white 278 1930 100 20
  Fill $g $white 0 2040 $w 1070;SectionLabel $g 'C11 · experimental' 22 2080 250;Text $g 'Compara las alternativas' (F 28 ([Drawing.FontStyle]::Bold)) $navy 22 2112 346 38;Text $g 'Desplaza la tabla para ver los tres planes a la vez.' (F 14) $muted 22 2160 346 36;Badge $g 'EQUILIBRIO · ORIENTACIÓN' 22 2212 210 $coral $white;Round $g $soft $line 22 2262 346 640 12 1;Text $g 'CRITERIO      BASE        EQUILIBRIO      FLEX' (F 10 ([Drawing.FontStyle]::Bold)) $navy 38 2290 900 20; $rows=@('Precio orientativo','Tipo de hogar','Patrón de recarga','Ventaja movilidad','Condición clave');$yy=2344;foreach($r in $rows){Line $g $line 38 ($yy-12) 750 ($yy-12) 1;Text $g $r (F 12 ([Drawing.FontStyle]::Bold)) $navy 38 $yy 270 24;Text $g '29,90 €   39,90 €   49,90 €' (F 11) $ink 38 ($yy+28) 700 22;$yy+=86};Text $g 'Vista condensada en móvil · lectura simultánea conservada' (F 11) $muted 38 2780 290 40;Button $g 'Elegir una opción' 38 2840 220 $false
  Fill $g $soft 0 3110 $w 960;SectionLabel $g 'C12 · experimental' 22 3150 250;Text $g 'Encuentra tu orientación' (F 28 ([Drawing.FontStyle]::Bold)) $navy 22 3184 346 38;Text $g 'Tres pasos, validación básica y resultado ficticio.' (F 14) $muted 22 3232 346 36;Round $g $navy $null 22 3300 346 78 14 0;Text $g '01  Tu vivienda      02      03' (F 13 ([Drawing.FontStyle]::Bold)) $white 42 3327 300 22;Round $g $white $line 22 3408 346 470 16 1;Text $g '1 / 3 · Tu vivienda' (F 12 ([Drawing.FontStyle]::Bold)) $coral 42 3440 220 20;Text $g '¿Qué tipo de vivienda tienes?' (F 21 ([Drawing.FontStyle]::Bold)) $navy 42 3480 300 60;$oy=3560;foreach($o in @('Piso','Casa','Otra vivienda')){Round $g $soft $line 42 $oy 306 46 8 1;Text $g $o (F 14 ([Drawing.FontStyle]::Bold)) $navy 58 ($oy+13) 270 20;$oy+=58};Text $g 'Validación: selecciona una opción' (F 12) $muted 42 3744 270 20;Button $g 'Siguiente' 42 3780 160 $false
  Fill $g $white 0 4070 $w 500;SectionLabel $g 'Una escena cotidiana' 22 4112 250;Text $g "Llegar a casa,`nestar listo para mañana" (F 25 ([Drawing.FontStyle]::Bold)) $navy 22 4146 346 76;Text $g 'La propuesta conecta vivienda, movilidad y claridad.' (F 14) $muted 22 4234 346 42;Round $g $white $null 22 4304 346 190 16 0;DrawHeroImage $g $hero 22 4304 346 190;Button $g 'Volver a comparar' 22 4515 210 $true
  Fill $g $soft 0 4580 $w 390;SectionLabel $g 'Después de pedir información' 22 4620 340;Text $g 'Un proceso fácil de seguir' (F 27 ([Drawing.FontStyle]::Bold)) $navy 22 4652 346 38;$y=4730;foreach($st in @(@('01','Cuéntanos tu situación'),@('02','Revisamos las opciones'),@('03','Decides con contexto'))){Text $g $st[0] (F 24 ([Drawing.FontStyle]::Bold)) $coral 22 $y 50 32;Text $g $st[1] (F 16 ([Drawing.FontStyle]::Bold)) $navy 82 ($y+4) 265 26;Text $g 'Paso ilustrativo de la conversación.' (F 12) $muted 82 ($y+32) 250 20;$y+=78}
  Fill $g $white 0 4970 $w 620;SectionLabel $g 'Dudas frecuentes' 22 5010 250;Text $g 'Preguntas frecuentes' (F 28 ([Drawing.FontStyle]::Bold)) $navy 22 5044 346 38;foreach($q in @('¿Quién puede usar esta orientación?','¿Los precios son reales?','¿Necesito un vehículo eléctrico?','¿Qué ocurre al solicitar contacto?')){Text $g $q (F 15 ([Drawing.FontStyle]::Bold)) $navy 22 $y 346 24;Line $g $line 22 ($y+38) 368 ($y+38) 1;$y+=76}
  Fill $g $navy 0 5590 $w 750;SectionLabel $g 'Siguiente paso' 22 5634 220;Text $g '¿Hablamos de cómo te mueves?' (F 29 ([Drawing.FontStyle]::Bold)) $white 22 5670 346 76;Text $g 'Solicita una conversación de demostración.' (F 15) $white 22 5760 346 34;Button $g 'Quiero hablar con Nexo' 22 5820 346 $false;Text $g 'Volver a la comparativa' (F 13 ([Drawing.FontStyle]::Bold)) $white 22 5885 220 22;Text $g 'Nexo Energía · concepto ficticio para validación' (F 11) $white 22 6265 346 20
  SaveJpeg $bmp $outPath; $g.Dispose()
}

New-Item -ItemType Directory -Force -Path (Join-Path $RunDir 'design') | Out-Null
$hero = [Drawing.Image]::FromFile($HeroPath)
RenderDesktop (Join-Path $RunDir 'design/desktop.jpg') $hero
RenderMobile (Join-Path $RunDir 'design/mobile.jpg') $hero
$hero.Dispose()
