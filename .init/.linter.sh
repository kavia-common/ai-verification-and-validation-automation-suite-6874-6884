#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-verification-and-validation-automation-suite-6874-6884/vv_ui
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

