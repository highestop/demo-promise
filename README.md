# demo-promise

Sometimes you need a Promise which can be resolved, rejected on anywhere else but inside Promise. In Javascript this can be done easily (but not sure properly?)

Also you might wonder if a Promise can be aborted before any resolve or reject happen, e.g. cancel a http request, or roll back a progress with a bunch of `async await` inside this chain. Aborting is another way to complete a Promise (we cannot leave this Promise pending after aborting or there would be a memory leak), but others who catch this Promise might need to distinguish whether it's been rejected or be aborted (abort means it cannot be resolved). So there should be a new kind of Error when a Promise is aborted, which lead you to catch in case. And the status of this Promise can be described as 'aborted'.
