# LicitIA Startup Funding & Valuation

Calculadora web local para que un emprendedor determine primero cuánto capital requiere y después estime la valuación y dilución de su ronda mediante First Chicago.

## Módulo incorporado: capital requerido

Calcula:

- Gastos operativos durante el horizonte seleccionado
- Inversiones no recurrentes
- Reserva de contingencia
- Ingresos acumulados proyectados
- Capital mínimo requerido
- Ronda objetivo redondeada
- Burn rate bruto y neto
- Runway con el efectivo disponible
- Mes estimado de break-even
- Distribución del uso de fondos
- Hitos financiados por la ronda

### Fórmula principal

```text
Capital requerido =
Gastos recurrentes
+ inversiones iniciales
+ contingencia
- ingresos proyectados
- efectivo disponible
- capital comprometido
```

La **ronda objetivo** redondea el capital mínimo hacia arriba. Si está activada la opción `Usar ronda objetivo calculada`, ese monto se utiliza automáticamente en la valuación First Chicago.

## Módulo First Chicago

Conserva:

- Escenarios optimista, base y pesimista
- Valuación pre-money y post-money
- Equity estimado para el inversionista
- Participación restante de fundadores
- Valor de salida esperado
- MOIC teórico
- Diagnóstico integrado de consistencia de la ronda

## Cómo revisar localmente

Abre `index.html` directamente en Chrome, Edge, Firefox o Safari.

Para probar la instalación PWA y el funcionamiento offline:

```bash
python3 -m http.server 8080
```

Después abre `http://localhost:8080`.


## Reporte de impresión y PDF

El botón **Imprimir reporte** genera un informe ejecutivo de exactamente **dos hojas tamaño carta americano (216 × 279 mm)**:

- Hoja 1: valuación, capital requerido, burn rate, runway, uso de fondos, hitos y diagnóstico.
- Hoja 2: variables globales, escenarios First Chicago, indicadores de inversión, consistencia de la ronda y límites del modelo.

El logotipo de LicitIA aparece una sola vez por hoja y en un tamaño discreto. Para guardar el reporte, selecciona **Guardar como PDF** en el cuadro de impresión del navegador.

## Estructura compatible con GitHub Pages

```text
index.html
README.md
LICENSE
.nojekyll
manifest.webmanifest
sw.js
assets/
  app.js
  styles.css
  icon.svg
  icon-192.png
  icon-512.png
  licitia-logo.jpg
```

## Límites del MVP

No modela impuestos, desfases de cobranza, inventarios, deuda, SAFE, notas convertibles, preferencias de liquidación, stock options, rondas futuras ni derechos de control. Antes de monetizarla conviene incorporar autenticación, reportes premium, almacenamiento en backend y pasarela de pago.
