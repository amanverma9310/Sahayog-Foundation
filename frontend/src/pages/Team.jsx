import ResourceListPage from '../components/resource/ResourceListPage'
import { teamApi } from '../lib/api'
import { columns, fields, schema } from '../config/team.jsx'

export default function Team() {
  return (
    <ResourceListPage title="Team member" api={teamApi} columns={columns} fields={fields} schema={schema} createLabel="New team member" />
  )
}
