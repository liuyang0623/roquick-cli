import { render } from 'preact'

function App() {
  return (
    <div>Hello cli-tsx-demo</div>
  )
}

export default function main() {
  render(<App/>, document.body)
}
