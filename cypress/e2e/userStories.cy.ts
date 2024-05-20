describe('Récits utilisateur', () => {
  const BACKEND_BASE_URL = 'http://127.0.0.1:3000'

  // On définit un utilisateur pour les tests. Cet utilisateur sera créé dans la base de données avant chaque test.
  const user = {
    email: 'mon@courriel.com',
    password: 'monmotdepasse',
    name: 'Bruce Lee',
    role: 'Student'
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

  it('je peux me connecter - version 1', () => {
    cy.visit('/login')
    cy.get('input[name=email-input]').type(user.email)
    cy.get('input[name=password-input]').type(user.password)
    cy.get('button[type=submit]').click()
    cy.contains(/déconnecter/i)
  })

  it('je peux me connecter - version 2', () => {
    cy.login(user.email, user.password)
  })

  it('je peux me déconnecter', () => {
    cy.login(user.email, user.password)
    cy.contains(/déconnecter/i).click()
    cy.contains(/connexion/i)
  })

  it('je peux voir mon profil', () => {
    cy.login(user.email, user.password)
    cy.contains(user.name)
    cy.contains(user.email)
  })

  it('je peux changer mon mot de passe', () => {
    cy.login(user.email, user.password)
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

  it('je peux créer une question', () => {
    cy.login(user.email, user.password)
    cy.visit('/createQuestion')
    cy.get('input[name=question-input]').type('Quelle est la signification de la vie ?')
    cy.get('select[name=category-select]').select('Philosophie')
    cy.get('select[name=priority-select]').select('Urgente')
    cy.get('button[type=submit]').click()
    cy.contains('Quelle est la signification de la vie ?')
  })

  it('je peux supprimer une question', () => {
    cy.login(user.email, user.password)
    cy.visit('/createQuestion')
    cy.get('input[name=question-input]').type('Quelle est la signification de la vie ?')
    cy.get('select[name=category-select]').select('Philosophie')
    cy.get('select[name=priority-select]').select('Urgente')
    cy.get('button[type=submit]').click()
    cy.contains('Quelle est la signification de la vie ?')

    cy.visit('/profile')
    cy.contains('Quelle est la signification de la vie ?')
    cy.get('button[name=delete-input]').click()
    cy.contains('Quelle est la signification de la vie ?').should('not.exist')
  })
})
