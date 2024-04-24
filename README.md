# TestareaSistemelorSoftware
### Echipa: A18
- Sandu Eduard Alexandru
- Nitoi Antonio
- Alexe Vasile Paul

# Jest Coverage Report

<!-- Jest Coverage Comment:Begin -->
| Lines | Statements | Branches | Functions |
| --- | --- | --- | --- |
| <a href="https://github.com/AlexePaul/TestareaSistemelorSoftware/blob/e2053aa981bb4c51f990ca5b71e09df1fe616b07/README.md"><img alt="Coverage: 98%" src="https://img.shields.io/badge/Coverage-98%25-brightgreen.svg" /></a><br/> | 98.3% (58/59) | 100% (23/23) | 96% (24/25) |

<details><summary>Coverage Report (<b>98%</b>)</summary><table><tr><th>File</th><th>% Stmts</th><th>% Branch</th><th>% Funcs</th><th>% Lines</th><th>Uncovered Line #s</th></tr><tbody><tr><td><b>All files</b></td><td><b>98.3</b></td><td><b>100</b></td><td><b>96</b></td><td><b>98.27</b></td><td>&nbsp;</td></tr><tr><td>&nbsp; &nbsp;<a href="https://github.com/AlexePaul/TestareaSistemelorSoftware/blob/e2053aa981bb4c51f990ca5b71e09df1fe616b07/About.js">About.js</a></td><td>75</td><td>100</td><td>50</td><td>75</td><td><a href="https://github.com/AlexePaul/TestareaSistemelorSoftware/blob/e2053aa981bb4c51f990ca5b71e09df1fe616b07/About.js#L10">10</a></td></tr><tr><td>&nbsp; &nbsp;<a href="https://github.com/AlexePaul/TestareaSistemelorSoftware/blob/e2053aa981bb4c51f990ca5b71e09df1fe616b07/Button.js">Button.js</a></td><td>100</td><td>100</td><td>100</td><td>100</td><td>&nbsp;</td></tr><tr><td>&nbsp; &nbsp;<a href="https://github.com/AlexePaul/TestareaSistemelorSoftware/blob/e2053aa981bb4c51f990ca5b71e09df1fe616b07/Home.js">Home.js</a></td><td>100</td><td>100</td><td>100</td><td>100</td><td>&nbsp;</td></tr><tr><td>&nbsp; &nbsp;<a href="https://github.com/AlexePaul/TestareaSistemelorSoftware/blob/e2053aa981bb4c51f990ca5b71e09df1fe616b07/TextBox.js">TextBox.js</a></td><td>100</td><td>100</td><td>100</td><td>100</td><td>&nbsp;</td></tr></tbody></table></details>
<!-- Jest Coverage Comment:End -->

# Jest vs Mocha
Am ales sa comparam framework-urile Jest [3] si Mocha [4] deoarece am observat ca acesta este un subiect dezbatut si fac parte din cele mai comune framework-uri de javascript.

| Jest | Mocha |
|------|-------|
|Usor de instalat, configurare minimala, folosind npm|Necesita configurare mai complexa necesita instalarea unor librarii aditionale|
|Usor de facut mocking|Nu are mocking integrat, trebuie folosite plugin-uri|
|Este foarte popular, astfel avand multe resurse la dispozitie pentru a invata|Este specializat in javascript testing, nu neaparat ideal pentru mobile development|
|Este mai potrivit d.p.d.v. al vitezei de rulare a testelor|Are spectru larg de librarii, este flexibil si este mai potrivit pentru proiecte mari si complexe|

## Exemplificarea comparatiei Jest vs Mocha folosind secvente de cod

Pentru a exemplifica argumentele aduse si pentru a putea deduce care dintre framework-uri este cel mai potrivit pentru tipul nostru de teste vom analiza prin cateva code snippets cum vom face mai multe tipuri de teste atat cu Jest, cat si cu Mocha.

### Teste unitare - Unit tests

In ceea ce priveste testele unitare, cele 2 framework-uri au un mod de functionare asemanator, insa tindem sa apreciem Jest fiind ceva mai intuitiv - in acest caz testam aceeasi functie pe un test unitar:

#### Jest

```
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

```

#### Mocha

```
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const assert = require('assert');
const sum = require('./sum');

describe('Sum', () => {
  it('should return 3 when adding 1 and 2', () => {
    assert.strictEqual(sum(1, 2), 3);
  });
});

```

### Teste de integrare - Integration testing

Testele de integrare constituie in a urmari interactiunea dintre mai multe module, componente si diverse secvente din cod. Astfel, pentru a ne asigura ca fiecare componenta functioneaza corespunzator, avem nevoie sa testam acest lucru fara a influenta alte componente sau dependencies - de cele mai multe ori prin a simula o anumita interactiune (mocking).

#### Jest

```
// fetchData.test.js
import React from 'react';
import { render, act } from '@testing-library/react';
import FetchData from './FetchData'; // Replace with path to your component

jest.mock('api/data.json', () => ({
  title: 'Test Title',
  content: 'Test Content',
}));

test('fetches data and displays it', async () => {
  const { getByText } = render(<FetchData />);

  await act(async () => {
    // Wait for data to be fetched
  });

  expect(getByText('Test Title')).toBeInTheDocument();
});

```

Am discutat anterior ca este mai usor sa facem mocking in Jest datorita existentei sale integrate, insa este util doar daca folosim date de mocking scrise de noi (spre exemplu, un fisier cu posibile date ce le-ar returna un API in format JSON)

Acest lucru face jest sa fie foarte time-consuming pentru ca ar insemna sa fie nevoie sa scriem date de test pentru toate interactiunile noastre cu alte componente sau dependencies.

#### Mocha

```
// fetchData.test.js
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import FetchData from './FetchData'; // Replace with path to your component

describe('FetchData component', () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch');
    fetchStub.resolves({ ok: true, json: () => ({ title: 'Test Title', content: 'Test Content' }) });
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it('fetches data and displays it', async () => {
    const wrapper = shallow(<FetchData />);

    await new Promise((resolve) => setTimeout(resolve, 0)); // Simulate async operation

    expect(wrapper.find('h1').text()).to.equal('Test Title');
  });
});

```

In schimb, in Mocha avem avantajul existentei unor librarii care ne fac viata mai usoara - avem control total asupra datelor mockuite si putem astfel sa le personalizam pentru a efectua testele de care avem nevoie folosind stubbing [5] (Sinon in acest caz este o librarie care ofera atat mocking cat si stubbing). [8]

### Teste functionale - Functionality testing

In ceea ce priveste testarea functionala, vom arata diferentele dintre cele 2 framework-uri in testarea unui buton care la click va afisa un label si va apela un `alert()`.

Jest poate fi deseori mai usor de folosit intrucat poate simula randarea unor componente fara a fi nevoie de mocking/stubbing al elementelor precum butoane, alerte etc. In Mocha, pentru a verifica daca un buton interactioneaza bine cand este apasat, trebuie sa mockuim obiectul `window` pentru a controla functii precum `alert()`, lucru care nu este tocmai optim din punct de vedere al performantei si al timpului de redactare al testelor.

#### Jest

```
// MyButton.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MyButton from './MyButton';

test('renders label and triggers alert on click', () => {
  const { getByText, getByRole } = render(<MyButton label="Click Me" />);

  expect(getByText('Click Me')).toBeInTheDocument();

  fireEvent.click(getByRole('button'));

  expect(window.alert).toHaveBeenCalledWith('Button Clicked!');
});
```

#### Mocha

```
// MyButton.test.js
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import MyButton from './MyButton';

describe('MyButton component', () => {
  let alertStub;

  beforeEach(() => {
    alertStub = sinon.stub(window, 'alert');
  });

  afterEach(() => {
    alertStub.restore();
  });

  it('renders label and triggers alert on click', () => {
    const wrapper = shallow(<MyButton label="Click Me" />);

    expect(wrapper.find('button').text()).to.equal('Click Me');

    wrapper.find('button').simulate('click');

    expect(alertStub.calledOnceWith('Button Clicked!')).to.be.true;
  });
});
```

Code snippets generate de ChatGPT [6] & Gemini [7]. 

### Bibliografie

|    | Nume autor | Prenume autor | Titlu articol online | URL | Data ultimei accesări |
|----|------|---------------|----------------------|-----|-----------------------|
|1|Felice|Sandra|Jest vs Mocha: Comparing NodeJS Unit Testing Frameworks|https://www.browserstack.com/guide/jest-vs-mocha|accesat la 09.04.2024|
|2|Tozzi|Chris|Comprehensive Comparison for Unit Testing Tools|https://saucelabs.com/resources/blog/jest-vs-mocha|accesat la 09.04.2024|
|3|-|-|Jest Official Documentation|https://jestjs.io/docs/tutorial-react-native|accesat la 09.04.2024|
|4|-|-|Mocha Official Documentation|https://github.com/mochajs/mocha|accesat la 09.04.2024|
|5|Syer|Dave|Unit Testing with Stubs and Mocks|https://spring.io/blog/2007/01/15/unit-testing-with-stubs-and-mocks|accesat la 15.04.2024
|6|-|-|OpenAI Generated Text| https://chat.openai.com | accesat la 16.04.2024|
|7|-|-|Gemini Generated Text| https://gemini.google.com | accesat la 16.04.2024|
|8|-|-|Sinon Testing Library Documentation|https://sinonjs.org/releases/v17/| accesat la 23.04.2024|
