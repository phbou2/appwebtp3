/* eslint-disable cypress/unsafe-to-chain-command */
describe('Récits utilisateur de type Teacher', () => {
  const BACKEND_BASE_URL = 'http://127.0.0.1:3000'

  // On définit un utilisateur pour les tests. Cet utilisateur sera créé dans la base de données avant chaque test.
  const user = {
    email: 'mon@courriel.com',
    password: 'monmotdepasse',
    name: 'Bruce Lee',
    role: 'Teacher'
  }

  // Exécuté avant chaque test
  beforeEach(() => {
    // On réinitialise la base de données en appelant le script backend:cypress:seed qui se trouve dans le package.json.
    cy.exec('npm run backend:cypress:seed')

    // On ajoute l'utilisateur à la BD en utilisant la commande POST /register de notre API REST (serveur backend).
    cy.request('POST', BACKEND_BASE_URL + '/register', {
      email: user.email,
      password: user.password,
      name: user.name
    })
  })

  // Les tests sont écrits sous forme de récits utilisateur.
  it("je peux accéder à la page d'accueil", () => {
    cy.visit('/')
    cy.contains('h1', /accueil/i)
  })

  it('je peux accéder à la page à propos', () => {
    cy.visit('/about')
    cy.contains('h1', /à propos/i)
  })

  it('je peux me connecter', () => {
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type(user.password)
    cy.get('button[type=submit]').click()
    cy.contains(/déconnecter/i)
  })

  it('je peux me déconnecter', () => {
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type(user.password)
    cy.get('button[type=submit]').click()
    cy.contains(/déconnecter/i).click()
    cy.contains(/connexion/i)
  })

  it('je peux voir mon profil', () => {
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type(user.password)
    cy.get('button[type=submit]').click()
    cy.contains(/déconnecter/i)
    cy.contains(user.name)
    cy.contains(user.email)
  })

  it('je peux changer mon nom', () => {
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type(user.password)
    cy.get('button[type=submit]').click()
    cy.visit('/changeCredentials')
    cy.get('input[name=new-name-input]').clear().type('Chuck Norris')
    cy.get('input[name=confirm-name-input]').clear().type('Chuck Norris')
    cy.get('button[type=submit]').click()
    cy.contains('Chuck Norris')
  })

  it('je peux changer mon mot de passe', () => {
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type(user.password)
    cy.get('button[type=submit]').click()
    cy.visit('/changeCredentials')
    cy.get('input[name=current-password-input]').type(user.password)
    cy.get('input[name=new-password-input]').type('newpassword')
    cy.get('input[name=confirm-password-input]').type('newpassword')
    cy.get('button[type=submit]').click()
    cy.contains(/déconnecter/i).click()
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type('newpassword')
    cy.get('button[type=submit]').click()
    cy.contains(/déconnecter/i)
  })

  it('je peux créer un étudiant', () => {
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type(user.password)
    cy.get('button[type=submit]').click()
    cy.visit('/register')
    cy.get('input[name=name-input]').type('John Doe')
    cy.get('input[name=email-input]').type('test@cypress.com')
    cy.get('input[name=password-input]').type('password')
    cy.get('button[type=submit]').click()
    cy.contains('John Doe')
  })

  it('je peux supprimer un étudiant', () => {
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type(user.password)
    cy.get('button[type=submit]').click()
    cy.visit('/register')
    cy.get('input[name=name-input]').type('John Doe')
    cy.get('input[name=email-input]').type('test@cypress.com')
    cy.get('input[name=password-input]').type('password')
    cy.get('button[type=submit]').click()
    cy.visit('/delete')
    cy.get('input[name=email-input]').type('test@cypress.com')
    cy.get('button[type=submit]').click()
    cy.contains('John Doe').should('not.exist')
  })
})
