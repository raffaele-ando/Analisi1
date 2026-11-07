# Esercizi dei temi d'esame, per argomento

Raccolta ragionata delle domande dei temi 2025/26 (prof. P. Dulio, Ing. Gestionale) con i risultati
verificati. Serve a chi scrive i contenuti per arrivare esattamente al livello richiesto.
Formato della prova: **Parte A** teoria (≈10 punti: definizioni, enunciati, dimostrazioni,
vero/falso motivati), **Parte B** esercizi (≈22 punti). Appello: 2 ore, soglia Parte A 8 (o 5 su 10
negli itinere), voto ≥ 18. Niente calcolatrice, niente appunti.

Sigle: IT1 = Itinere 11/11/2025, IT2 = Itinere 15/01/2026, A1 = Appello 15/01/2026,
A2 = 10/02/2026, A3 = 11/06/2026, A4 = 06/07/2026, A5 = 03/09/2026.

## Teoria (Parte A)
| Domanda | Dove | Punti |
|---|---|---|
| Definizione di funzione derivabile in $x_0$ | IT1 | 1 |
| Equazione $\log(2+x)+x=0$ ha soluzioni in $(-1,1)$? (teorema degli zeri: $f(-1)=-1<0$, $f(1)=\log 3+1>0$) | IT1 | 3 |
| Derivata di $\log(x+1)$ con il teorema della funzione inversa ($x=e^y-1$, $y'=1/e^y=1/(x+1)$) | IT1 | 2 |
| **Derivabile ⇒ continua** (dimostrazione) | IT1 | 2 |
| Definizione di punto angoloso | IT1 | 2 |
| Definizione di cuspide | A4 | 1 |
| **Unicità del limite** per successioni (dimostrazione, $|L_1-L_2|<2\varepsilon$) | A1 | 2 |
| Derivata di $e^x$ con la definizione (limite notevole $\frac{e^h-1}{h}\to1$) | A1 | 2 |
| Derivata di $e^x+\sin x$ con la definizione (risultato corretto $e^x+\cos x$; la soluzione ufficiale ha un errore di segno) | A4 | 3 |
| **Condizione necessaria di convergenza** delle serie (dimostrazione con $a_n=s_n-s_{n-1}$) | IT2, A1 | 3 |
| Sviluppabilità in serie di Taylor e condizione $|f^{(n)}(x)|\le M\,n!/\delta^n$ | IT2 | 2 |
| Serie geometrica di ragione $x$: converge per $-1<x<1$ | IT2 | 2 |
| V/F: $\sum_{n\ge0}\frac{2n+3}{3n+1}=\frac23$ (falso: termine generale $\to 2/3\neq0$) | IT2, A1 | 1 |
| V/F: $\sum_{n\ge2}\frac1{2^n}=\frac12$ (vero: $2-1-\frac12$) | A4 | 2 |
| $\sum_{n\ge\alpha}\frac1{n(n+1)}=\frac12$ per quale $\alpha$? (Mengoli senza primo termine: $\alpha=2$) | A5 | 2 |
| Definizione di serie convergente + esempi convergente/divergente/indeterminata | A2 | 2 |
| **Criterio del confronto** per serie (dimostrazione con somme parziali monotone) | A3 | 3 |
| Prodotto scalare: definizione e formula in coordinate | IT2, A1 | 2 |
| Prodotto vettoriale: definizione (modulo, direzione, verso) | A2 | 2 |
| Prodotto vettoriale in componenti | A3 | 1 |
| Esistono $P,Q$ sul piano $x-y+z=0$ con $\vec{OP}\wedge\vec{OQ}=(1,-1,3)$? (no: deve essere parallelo a $(1,-1,1)$) | A5 | 3 |
| Definizione di rette sghembe (non complanari) | A4 | 1 |
| **Teorema di Fermat** (enunciato e dimostrazione) | A2, A3 | 2–3 |
| $f(a)<0$, $f(b)>0$, esiste $c$ con $f(c)=0$: $f$ è per forza continua? (no, controesempio a tratti) | A2 | 2 |
| $f(0)=f'(0)=0$, $f''(0)=1$ ⇒ $\lim_{x\to0}\frac{f(x)}{\log(1-x^2)}=-\frac12$ (de l'Hôpital due volte) | A2 | 2 |
| **Teorema dei valori intermedi** (dimostrazione via teorema degli zeri su $f-\lambda$) | A4 | 3 |
| **Permanenza del segno** (dimostrazione con $\varepsilon=f(c)/2$) | A5 | 2 |
| $f(x)=x+\frac12\sin x$ è invertibile? ($f'\ge\frac12>0$) | A5 | 2 |
| Funzione strettamente crescente: definizione | A5 | 1 |
| Formula delle radici $n$-esime di un complesso | A3 | 2 |
| $f$ continua in $(0,1]$ con $\int_0^1 xf<\infty$ e $\int_0^1 f=+\infty$ (es. $1/x$) | A3 | 1 |

## Esercizi (Parte B)

### Studio di funzione / estremi (5–6 punti)
- IT1: punti stazionari di $e^x(x^2+3x+3)$: $f'=e^x(x^2+5x+6)$, max relativo in $-3$, min relativo in $-2$ (non assoluti).
- IT1: $f=\frac{\sqrt{x-1}}{\sqrt{5-x}}$: dominio $[1,5)$, min assoluto $0$ in $1$, non limitata sopra.
- A1: $f=x\log x$ per $x<1$, $\frac{x-1}{2x-3}$ per $x\ge1$: dominio $(0,\frac32)\cup(\frac32,+\infty)$, $\lim_{0^+}=0$, asintoto verticale $x=\frac32$, orizzontale $y=\frac12$, punto angoloso in $1$ ($f'_-=1$, $f'_+=-1$), min relativo $f(e^{-1})=-e^{-1}$, max relativo $f(1)=0$; area $-\int_0^1x\log x=\frac14$.
- A2: $(x^2-3)e^{-|2-x|}$: zeri $\pm\sqrt3$, asintoto $y=0$, punto angoloso in $2$ ($f'_-=5$, $f'_+=3$), stazionari $-3,1,3$, crescente su $(-\infty,-3)$ e $(1,3)$.
- A3: $e^{1/(4-x^2)}$: dominio $x\neq\pm2$, $\lim_{2^-}=+\infty$, $\lim_{2^+}=0$, $y=1$ asintoto orizzontale, $f'=\frac{2x}{(4-x^2)^2}e^{1/(4-x^2)}$, min locale in $(0,e^{1/4})$.
- A4: $2\sin x+\cos 2x$ su $[0,2\pi]$: $f'=2\cos x(1-2\sin x)$, max in $\frac\pi6,\frac{5\pi}6$ (valore $\frac32$), min assoluto in $\frac{3\pi}2$ (valore $-3$). In $\frac\pi2$ la derivata passa da $-$ a $+$: è un **minimo relativo** ($f=1$), non un punto \"né max né min\" come scrive la soluzione ufficiale.
- A5: $e^{\frac{x+1}{x-1}}$ per $x<1$, $x^2+\log x$ per $x\ge1$: asintoto $y=e$ a $-\infty$, salto in $1$, decrescente per $x<1$, crescente per $x>1$, esiste un flesso per $x<1$.

### Numeri complessi (2–4 punti)
- IT1: $(z-1)(\bar z-i)=0$ ⇒ $z=1$, $z=-i$.
- A1: $\bar z(z+i)z-i(z+i)(z-\bar z)=0$ ⇒ $(z+i)(x^2+y^2+2y)=0$: circonferenza di centro $-i$ raggio 1.
- A2: $(z+2i)^4=9(1+i)^8$ ⇒ $z+2i=2\sqrt3\,e^{ik\pi/2}$: $2\sqrt3-2i$, $2(\sqrt3-1)i$, $-2\sqrt3-2i$, $-2(\sqrt3+1)i$.
- A3: $(z+2-i)^3=i$ ⇒ $z=\frac{\sqrt3-4}2+\frac32i$, $-\frac{\sqrt3+4}2+\frac32i$, $-2$.
- A4: $z^4-4z^2+13=0$ ⇒ $z^2=2\pm3i$ ⇒ $z=\pm\left(\sqrt{\tfrac{\sqrt{13}+2}2}\pm i\sqrt{\tfrac{\sqrt{13}-2}2}\right)$.
- A5: $\frac{z+\bar z}{iz+1}=ki$ ⇒ $(2+k)x+ki(y-1)=0$, $z\neq i$: nessuna soluzione per $k\neq0,-2$; $k=-2$: $z=x+i$, $x\neq0$; $k=0$: $z=iy$, $y\neq1$.

### Limiti, successioni, infinitesimi, Taylor (2–6 punti)
- IT1: $\lim_{x\to0}\frac{\tan x+\log(1+x^2)}{2x}=\frac12$.
- IT1: $\frac{\log(n+1)}{n^{1/3}}\to0$; $(1+\frac2n)^{n/2}\to e$; $n(\sqrt{1+\frac1n}-1)\to\frac12$.
- IT1: $a_n=(-1)^n(1+\frac1n)$: limitata, $\max=\sup=\frac32$ ($n=2$), $\min=\inf=-2$ ($n=1$).
- IT2/A1: $1+x^\alpha\sin 2x-\cos x$ per $x\to0$: infinitesima per $\alpha>-1$; ordine $\alpha+1$ e p.p. $2x^{\alpha+1}$ se $-1<\alpha<1$; ordine 2, p.p. $\frac52x^2$ se $\alpha=1$; ordine 2, p.p. $\frac12x^2$ se $\alpha>1$.
- A2: $\lim_{x\to0^+}\frac{x^4e^x-x^3\log(1+x)-\frac32x^5}{x^2(\frac12\sin x^2-1+\cos x)}=4$.
- A3: $1-\cos(\log(1+\sqrt x))=\frac x2+o(x)$; $\lim_{x\to0}\frac{(1-\cos\log(1+\sqrt x))x}{x-\sin(x+x^2)}=-\frac12$.
- A4: Taylor di ordine 2 di $x\cos x+\sin x$ in $\pi$: $-\pi-2(x-\pi)+\frac\pi2(x-\pi)^2+o((x-\pi)^2)$.

### Integrali e integrali impropri (3–6 punti)
- IT2/A1: $\int_1^{+\infty}\frac{\log^{1-\beta}x}{(x-1)^\alpha}dx$ converge sse $\alpha>1$ e $\alpha+\beta<2$.
- IT2: primitiva di $\frac{\log(1+t)}{t^2}$: $-\frac{\log(1+t)}t+\log t-\log(1+t)+C$; $\int_1^{+\infty}=2\log2$.
- A2: $\int_0^1\frac{(1-\cos x)^\alpha}{(e^x-1-x)(1-x)^\beta}$ converge sse $\alpha>\frac12$, $\beta<1$; $\int_1^{+\infty}\frac{(1-\cos x)^\gamma}{(e^x-1-x)(x-1)^\delta}$ converge sse $\delta<1$ (ogni $\gamma$).
- A3: $\int_1^{+\infty}\frac{\arctan x}{x^{\beta+1/2}}$ converge sse $\beta>\frac12$; per $\beta=\frac32$ vale $\frac\pi4+\frac{\log2}2$.
- A4: area tra $e^{-x}\sin x$ e l'asse $x$ su $[0,2\pi]$: $\frac12(1+e^{-\pi})^2$.
- A5: $\frac{x^a+1}{x^a+x^2}$ integrabile a $+\infty$ sse $a<1$; $\int_1^{+\infty}\frac{dx}{x^2-x+1}=\frac{2}{\sqrt3}\left(\frac\pi2-\frac\pi6\right)=\frac{2\pi}{3\sqrt3}$ (la soluzione ufficiale scrive gli estremi $0$ e $c$, ma il valore dall'estremo $1$ è questo).

### Serie (2–4 punti)
- IT2/A1: $\sum(-1)^n\frac1{(\sqrt n\log(1+n))^\gamma}$: converge semplicemente per $\gamma>0$, assolutamente per $\gamma\ge2$.
- IT2: $\sum_{k\ge0}(-1)^k\frac{\pi^{2k+1}}{4^{2k+1}(2k+1)!}=\sin\frac\pi4=\frac{\sqrt2}2$, converge anche assolutamente.
- A2: $\sum n^\alpha\frac{(2n^3+n^2)^{1/5}-(2n^3)^{1/5}}{\log(1+\tan\frac2{n^2})}$: termine $\sim c\,n^{\alpha+8/5}$, converge sse $\alpha<-\frac{13}5$; $\sum(-1)^n\frac{\log n}{\sqrt n}$ converge semplicemente, non assolutamente.
- A3: $\sum\left(1-\cos\log(1+\frac1{\sqrt n})\right)\sin\frac1{n^\alpha}\sim\frac1{2n^{1+\alpha}}$: converge per ogni $\alpha>0$.
- A4: $\sum(-1)^n\frac{\log(n^2+2)}{n^3}$ converge assolutamente.
- A5: $\sum\frac{\sqrt[3]n\sin(n^{-\alpha})}{\log\frac{n^3+1}{n^3}}\sim n^{10/3-\alpha}$: converge sse $\alpha>\frac{13}3$; condizione necessaria verificata per $\alpha>\frac{10}3$.

### Geometria (3–8 punti)
- IT2/A1: $r=\pi_1\cap\pi_2$ con $\pi_1:4x+y-z-6=0$, $\pi_2:2x-y-z=0$: $r:(1+\frac t3,\,2-\frac t3,\,t)$, direzione $(1,-1,3)$; piano per $r$ e $P(0,3,0)$: $x+y-3=0$; piano per $P$ ortogonale a $r$: $x-y+3z+3=0$, intersezione $(\frac9{11},\frac{24}{11},-\frac6{11})$.
- A2: $A(1,1,-1)$, $r:(2-t,1+t,-1)$: piano per $A$ ortogonale a $r$: $x-y=0$; $H=(\frac32,\frac32,-1)$, $d(A,r)=\frac1{\sqrt2}$; piano per $O$ e $A$ parallelo a $r$: $x+y+2z=0$; $d(r,\alpha)=\frac1{\sqrt6}$.
- A3: $r:(1+3t,3-t,1-2t)$, $s:(3-u,\gamma+u,1+u)$ incidenti per $\gamma=5$ in $P(7,1,-3)$; piano che le contiene: $x-y+2z=0$.
- A4: $r_1:(2+t,1-t,3+2t)$, $r_2:(1+2s,-1+s,4-s)$: retta per $(1,2,-1)$ perpendicolare a entrambe: direzione $v_1\wedge v_2=(-1,5,3)$; $r_1$ e $s$ sono sghembe, distanza $\frac{|\langle P_2-P_1,\,v_1\wedge v_s\rangle|}{|v_1\wedge v_s|}=\frac{8}{\sqrt{210}}$.
- A5: sfera di centro $C(2,-1,-3)$ tangente a $x-y+2z-1=0$: raggio $\frac4{\sqrt6}$, punto di tangenza $(\frac83,-\frac53,-\frac53)$.
