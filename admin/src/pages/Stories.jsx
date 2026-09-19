import ResourceListPage from '../components/resource/ResourceListPage'
import { storiesApi } from '../lib/api'
import { columns, fields, schema } from '../config/stories.js'

export default function Stories() {
  return (
    <ResourceListPage title="Story" api={storiesApi} columns={columns} fields={fields} schema={schema} createLabel="New story" />
  )
}
