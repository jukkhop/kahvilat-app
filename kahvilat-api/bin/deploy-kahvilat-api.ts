#!/usr/bin/env node
/* eslint-disable no-new */

import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'

import { initConfig } from '../deploy/config'
import { KahvilatApiStack } from '../deploy/kahvilat-api-stack'

const config = initConfig()
const app = new cdk.App()

new KahvilatApiStack(app, `kahvilat-api-${config.aws.stage}`, {
  env: {
    account: config.aws.accountId,
    region: config.aws.region,
  },
})
