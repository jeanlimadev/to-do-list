
const Main = {

  tasks: [],

  init: function() { // parte inicial do objeto que tem por função chamar as demais funções abaixo
    this.cacheSelectors()
    this.bindEvents()
    this.getStoraged()  
    this.buildTasks()
  },

  cacheSelectors: function() { // parte do objeto onde são criadas todas as variáveis de captura de elementos no HTML
    this.$checkButtons = document.querySelectorAll('.check') 
    this.$inputTask = document.querySelector('#inputTask') // Variáveis iniciadas com '$' somente para identificá-las mais facilmente
    this.$list = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll('.remove')
    this.$error = document.querySelector('.error')
  },

  bindEvents: function() {  // parte do objeto que contem todos as chamadas de eventos
    const self = this // variável criada para solucionar o problema do this dentro do forEach não ser referente ao Main
    this.$checkButtons.forEach(function(button){
      button.onclick = self.Events.checkButton_click.bind(self)
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

    this.$removeButtons.forEach(function(button){
      button.onclick = self.Events.removeButton_click.bind(self)
    })
  },

  getStoraged: function() {
    const tasks = localStorage.getItem('tasks')

    if (tasks) {
      this.tasks = JSON.parse(tasks)
    } else {
      localStorage.setItem('tasks', JSON.stringify([]))
    }
  },

  getTaskHtml: function(task, done) {
    return `
    <li data-task="${task}" class="${done}">
      <div class="check"></div>
      <label class="task">
        ${task}
      </label>
      <button class="remove" data-task="${task}"></button>
    </li>
  `
  },

  buildTasks: function() {
    let html = ''

    this.tasks.forEach(item => {
      if (item.done === true) {
        html += this.getTaskHtml(item.task, item.done = 'done')
      } else {
        html += this.getTaskHtml(item.task)
      }
    })

    this.$list.innerHTML = html

    this.cacheSelectors()
    this.bindEvents()
  },

  Events: { // parte do objeto que  contém todos os eventos separadamente para melhor organização
    checkButton_click: function(e) {
      const li = e.target.parentElement
      const isDone = li.classList.contains('done') // contains é utilizado para saber se determinada classe já existe no CSS
      
      const savedTasks = localStorage.getItem('tasks')
      const savedTasksObj = JSON.parse(savedTasks)

      const value = li.dataset['task']
      const newtasksStage = savedTasksObj.filter(item => item.task === value)      

      if (!isDone) {
        savedTasksObj[savedTasksObj.indexOf(newtasksStage[0])].done = true

        localStorage.setItem('tasks', JSON.stringify(savedTasksObj))

        li.classList.add('done')
        
      } else {
        savedTasksObj[savedTasksObj.indexOf(newtasksStage[0])].done = false

        localStorage.setItem('tasks', JSON.stringify(savedTasksObj))

        li.classList.remove('done')
      }
    },

    inputTask_keypress: function(e) {
      const key = e.key
      const value = e.target.value

      if(key === 'Enter' && this.$inputTask.value != '') {
        this.$list.innerHTML += this.getTaskHtml(value)
        
        e.target.value = ''

        this.cacheSelectors() // chamando novamente pq toda vez que a árvore do HTML é alterada há a necessidade de recarregar todas as funções e eventos
        this.bindEvents()

        const savedTasks = localStorage.getItem('tasks')
        const savedTasksObj = JSON.parse(savedTasks)

        const obj = [
          ...savedTasksObj,
          {task: value, done: false},
        ]

        this.tasks = obj
        localStorage.setItem('tasks', JSON.stringify(obj))
      }
    },

    removeButton_click: function(e) {
      const li = e.target.parentElement
      const value = li.dataset['task']

      const newtasksStage = this.tasks.filter(item => item.task !== value)

      localStorage.setItem('tasks', JSON.stringify(newtasksStage))
      this.tasks = newtasksStage      

      li.classList.add('removed')

      setTimeout(function(){
        li.classList.add('hidden')
      },300)
    }
  }

}

Main.init()