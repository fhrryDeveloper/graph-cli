const { withSpinner, step } = require('./command-helpers/spinner')

const MIGRATIONS = [
    require('./migrations/mapping_api_version_0_0_1'),
    require('./migrations/mapping_api_version_0_0_2')
]

const applyMigrations = async options =>
  await withSpinner(
    `Apply migrations`,
    `Failed to apply migrations`,
    `Warnings while applying migraitons`,
    async spinner => {
      return Promise.all(
        MIGRATIONS.map(async migration => {
          let skipHint = await migration.predicate(options)
          if (typeof skipHint !== 'string' && skipHint) {
            step(spinner, 'Apply migration:', migration.name)
            await migration.apply(options)
          } else {
            if (typeof skipHint === 'string') {
              step(spinner, 'Skip migration:', `${migration.name} (${skipHint})`)
            } else {
              step(spinner, 'Skip migration:', `${migration.name}`)
            }
          }
        }),
      )
    },
  )

module.exports = {
  applyMigrations,
}
