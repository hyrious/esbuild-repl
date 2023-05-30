import Inspector from './components/Inspector.svelte'

function create_inspector_host() {
  const id = 'svelte-inspector-host'
  if (document.getElementById(id) != null) {
    throw new Error('svelte-inspector already exists')
  }
  const el = document.createElement('div')
  el.id = id
  document.documentElement.appendChild(el)
  return el
}

Object.assign(window, {
  inspector: new Inspector({ target: create_inspector_host() }),
})
