# Mappa del curriculum (id fissi)

Gli id di sezione e di skill qui sotto sono **fissi**: servono per i prerequisiti tra sezioni,
per collegare le domande d'esame agli argomenti e per il salvataggio dei progressi.
Una sezione può aggiungere skill extra con id nuovi (`sNN.nome`), ma non rinominare questi.

Fonti: Programma svolto 2025, Programma della prima verifica in itinere, temi d'esame 2021–2026
con soluzioni. Le voci in **grassetto** sono quelle di cui il programma chiede la dimostrazione.

## s00 · Fondamenta (da zero) — `s00-fondamenta.js`
- `s00.numeri` Frazioni, potenze (esponenti interi e razionali), radicali, razionalizzazione
- `s00.algebra` Polinomi, prodotti notevoli, scomposizione, Ruffini, frazioni algebriche
- `s00.equazioni` Equazioni di 1° e 2° grado, discriminante, biquadratiche, equazioni fratte, sistemi lineari
- `s00.disequazioni` Disequazioni di 1° e 2° grado, fratte (studio del segno), sistemi, con valore assoluto, irrazionali
- `s00.esplog` Esponenziali e logaritmi: definizione, proprietà, grafici, equazioni e disequazioni
- `s00.trig` Trigonometria: radianti, circonferenza goniometrica, valori notevoli, identità, addizione e duplicazione, equazioni e disequazioni elementari
- `s00.logica` Logica e dimostrazioni: connettivi, implicazione, quantificatori e loro negazione, condizione necessaria/sufficiente, dimostrazione diretta, per assurdo, controesempio, induzione
- `s00.insiemi` Insiemi: appartenenza, inclusione, unione, intersezione, differenza, complementare, prodotto cartesiano

## s01 · Insiemi numerici e numeri reali — `s01-reali.js`
- `s01.naturali` ℕ, ℤ, ℚ; fattoriale, coefficiente binomiale, Tartaglia, binomio di Newton, induzione
- `s01.irrazionali` **Irrazionalità di √2**, numerabilità di ℚ, cardinalità
- `s01.relazioni` Relazioni tra insiemi, relazioni di equivalenza e d'ordine
- `s01.reali` ℝ: proprietà algebriche e d'ordine, assioma di Dedekind, intervalli, intorni, valore assoluto, disuguaglianza triangolare
- `s01.supinf` Maggioranti, minoranti, sup, inf, max, min; insiemi limitati; caratterizzazione con ε

## s02 · Numeri complessi — `s02-complessi.js`
- `s02.algebrica` Forma algebrica, operazioni, coniugato, modulo, divisione, piano di Gauss
- `s02.trigonometrica` Forma trigonometrica ed esponenziale, argomento, Eulero, prodotto e potenze (De Moivre)
- `s02.radici` Radici n-esime: definizione, formula, teorema di struttura, poligoni regolari
- `s02.equazioni` Equazioni in ℂ: secondo grado, con $\bar z$ (luoghi con $z=x+iy$), sostituzione $w=z+c$, biquadratiche, con parametro; teorema fondamentale dell'algebra

## s03 · Funzioni reali — `s03-funzioni.js`
- `s03.base` Funzione, dominio (campo di esistenza), immagine, grafico, operazioni tra funzioni
- `s03.proprieta` Iniettive, suriettive, biiettive; composte; inverse
- `s03.simmetrie` Pari/dispari (anche somme, prodotti, composizioni), periodiche, monotone, limitate; sup/inf/max/min di una funzione
- `s03.elementari` Grafici elementari e trasformazioni di grafici

## s04 · Successioni — `s04-successioni.js`
- `s04.def` Definizione, "definitivamente", limitatezza, monotonia; max/min/sup/inf di successioni
- `s04.limiti` Convergenza (ε), divergenza, indeterminate, **unicità del limite**, permanenza del segno, confronto, algebra dei limiti
- `s04.monotone` **Successioni monotone e limitate**, numero di Nepero, gerarchia degli infiniti, $b^n/n!\to 0$

## s05 · Limiti di funzioni — `s05-limiti.js`
- `s05.def` Definizione topologica e successionale; limiti destro e sinistro; limiti che non esistono
- `s05.calcolo` Algebra dei limiti, forme indeterminate, raccoglimento, razionalizzazione, composte
- `s05.notevoli` Limiti notevoli ($\frac{1-\cos x}{x^2}$, $(1+\frac1x)^x$, $\frac{(1+x)^\alpha-1}{x}$, $\frac{\log(1+x)}{x}$, $\frac{\sin x}{x}$, $\frac{e^x-1}{x}$)
- `s05.asintoti` Asintoti orizzontali, verticali e obliqui

## s06 · Infinitesimi e infiniti — `s06-infinitesimi.js`
- `s06.o` o-piccolo e asintotico; regole di calcolo; sostituzione nei limiti
- `s06.ordine` Ordine e parte principale (anche con parametro)
- `s06.gerarchia` Confronto, gerarchia, stime asintotiche

## s07 · Continuità — `s07-continuita.js`
- `s07.def` Continuità, $C^0(A)$, composte, classificazione delle discontinuità, funzioni a tratti con parametro
- `s07.teoremi` **Permanenza del segno**, zeri, Weierstrass, **valori intermedi**, controesempi
- `s07.inversa` Monotonia, invertibilità, continuità dell'inversa

## s08 · Derivate — `s08-derivate.js`
- `s08.def` Rapporto incrementale, significato geometrico e fisico, tangente, **derivate con la definizione**
- `s08.regole` Algebra delle derivate, funzione composta
- `s08.inversa` **Derivata dell'inversa**, inverse trigonometriche, funzioni iperboliche
- `s08.punti` **Derivabile ⇒ continua**, derivate laterali, punti angolosi, cuspidi, flessi a tangente verticale, funzioni a tratti
- `s08.teoremi` Punti critici, **Fermat**, Rolle, **Lagrange** e conseguenze, test di monotonia, invertibilità
- `s08.hopital` De l'Hôpital
- `s08.convessita` Differenziale, derivate successive, epigrafico, concavità, convessità, flessi

## s09 · Studio di funzione — `s09-studio.js`
- `s09.estremi` Punti stazionari e loro natura, estremi relativi e assoluti, max/min su intervallo chiuso, limitatezza
- `s09.studio` Studio completo del grafico (anche con modulo, a tratti, esponenziali)

## s10 · Formula di Taylor — `s10-taylor.js`
- `s10.formula` Polinomio di Taylor, resto di Peano e di Lagrange, Taylor in $x_0\neq 0$
- `s10.sviluppi` Sviluppi di McLaurin notevoli e di funzioni composte
- `s10.limiti` Limiti e ordini di infinitesimo con Taylor

## s11 · Integrali — `s11-integrali.js`
- `s11.riemann` Integrale di Riemann, proprietà, teorema della media, funzione integrale, teorema fondamentale
- `s11.immediati` Primitive, integrali immediati, decomposizione lineare
- `s11.parti` Integrazione per parti
- `s11.sostituzione` Integrazione per sostituzione
- `s11.razionali` Funzioni razionali fratte (fratti semplici, caso arcotangente)
- `s11.aree` Calcolo di aree (attenzione al segno)

## s12 · Integrali impropri — `s12-impropri.js`
- `s12.def` Definizione e calcolo con il limite
- `s12.criteri` Confronto, confronto asintotico, condizione necessaria, integrali campione $\frac{1}{x^\alpha}$ e $\frac{1}{x^\alpha\log^\beta x}$
- `s12.parametri` Convergenza al variare di parametri (livello esame)

## s13 · Serie numeriche — `s13-serie.js`
- `s13.def` Somme parziali, convergenti/divergenti/indeterminate, geometrica, Mengoli, telescopiche
- `s13.necessaria` **Condizione necessaria di convergenza**, armonica e armonica generalizzata
- `s13.positivi` Termini positivi, **confronto**, confronto asintotico, radice, rapporto, criterio integrale
- `s13.alterni` Leibniz, convergenza semplice e assoluta
- `s13.parametri` Serie con parametri tramite stime asintotiche e Taylor

## s14 · Serie di Taylor — `s14-serie-taylor.js`
- `s14.serie` Serie di Taylor, raggio, sviluppabilità, funzione $C^\infty$ non analitica, esponenziale complessa, Eulero
- `s14.somme` Somme con le serie note, somme di razionali che danno irrazionali

## s15 · Geometria analitica — `s15-geometria.js`
- `s15.vettori` Vettori, versori, componenti, operazioni, **prodotto scalare**, angolo
- `s15.vettoriale` **Prodotto vettoriale**, area, proprietà
- `s15.rette` Rette parametriche e cartesiane, parallelismo, ortogonalità, incidenti, sghembe, angolo, retta come intersezione di piani
- `s15.piani` Piano dato il vettore normale, per tre punti, contenente due rette, fascio di piani, posizioni reciproche, intersezioni
- `s15.distanze` Distanze punto-punto, punto-piano, punto-retta, retta-piano, retta-retta; sfera tangente a un piano

## Esami — `exams-*.js`
Temi reali strutturati (Parte A teoria + Parte B esercizi), collegati alle skill.
