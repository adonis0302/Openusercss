import test from 'ava'
import Component from '../../app/components/bits/b-input.vue'

test('has a mounted hook', async (t) => {
  t.is(typeof Component.mounted, 'function')
})

test('warns on created', async (t) => {
  t.true(Component.created.toString().includes('console.warn'))
})
