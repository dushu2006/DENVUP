# Missing Git Submodules in the Uploaded Google Skills ZIP

The Google Skills archive was a GitHub-generated source ZIP. Such ZIP files preserve `.gitmodules` but do not include the contents of Git submodules. The main repository files and skills present in the uploaded ZIP are preserved. The following external repositories were declared as submodules and are not assumed to be bundled unless their content is separately present in the source tree.

| Submodule | Path | URL | Branch/tag |
|---|---|---|---|
| `alloydb` | `plugins/cloud/data-cloud/alloydb` | https://github.com/GoogleCloudPlatform/alloydb-plugin | `0.2.0` |
| `alloydb-omni` | `plugins/cloud/data-cloud/alloydb-omni` | https://github.com/GoogleCloudPlatform/alloydb-omni-plugin | `0.2.2` |
| `bigquery-data-analytics` | `plugins/cloud/data-cloud/bigquery-data-analytics` | https://github.com/GoogleCloudPlatform/bigquery-data-analytics-plugin.git | `0.2.5` |
| `cloud-sql-mysql` | `plugins/cloud/data-cloud/cloud-sql-mysql` | https://github.com/GoogleCloudPlatform/cloud-sql-mysql-plugin | `0.2.0` |
| `cloud-sql-postgresql` | `plugins/cloud/data-cloud/cloud-sql-postgresql` | https://github.com/GoogleCloudPlatform/cloud-sql-postgresql-plugin | `0.4.0` |
| `cloud-sql-sqlserver` | `plugins/cloud/data-cloud/cloud-sql-sqlserver` | https://github.com/GoogleCloudPlatform/cloud-sql-sqlserver-plugin | `0.2.0` |
| `data-agent-kit-plugin` | `plugins/cloud/data-cloud/data-agent-kit-plugin` | https://github.com/GoogleCloudPlatform/data-agent-kit-plugin | `1.0.0` |
| `dataproc` | `plugins/cloud/data-cloud/dataproc` | https://github.com/GoogleCloudPlatform/dataproc-plugin.git | `0.1.0` |
| `db-context-enrichment` | `plugins/cloud/data-cloud/db-context-enrichment` | https://github.com/GoogleCloudPlatform/db-context-enrichment.git | `v0.7.2` |
| `firestore-native` | `plugins/cloud/data-cloud/firestore-native` | https://github.com/GoogleCloudPlatform/firestore-native-plugin | `0.3.4` |
| `google-cloud-storage` | `plugins/cloud/data-cloud/google-cloud-storage` | https://github.com/GoogleCloudPlatform/google-cloud-storage-plugin | `3.0.1` |
| `knowledge-catalog` | `plugins/cloud/data-cloud/knowledge-catalog` | https://github.com/GoogleCloudPlatform/knowledge-catalog-plugin.git | `0.5.4` |
| `looker` | `plugins/cloud/data-cloud/looker` | https://github.com/GoogleCloudPlatform/looker-plugin | `0.3.11` |
| `oracledb` | `plugins/cloud/data-cloud/oracledb` | https://github.com/GoogleCloudPlatform/oracledb-plugin | `0.2.7` |
| `spanner` | `plugins/cloud/data-cloud/spanner` | https://github.com/GoogleCloudPlatform/spanner-plugin | `0.3.6` |
| `cloud-bigtable-ecosystem` | `plugins/cloud/data-cloud/cloud-bigtable-ecosystem` | https://github.com/GoogleCloudPlatform/cloud-bigtable-ecosystem.git | `v0.4.0` |

To include these external repositories too, fetch the submodules from their source URLs and review their licenses before redistributing them as part of a combined pack.