# demo-promise

Sometimes you need a Promise which can be resolved, rejected on anywhere else but inside Promise. In Javascript this can be done easily (but not sure properly?).

Also you might wonder if I can abort a Promise before any resolve or reject happen, e.g. cancel a http request, or roll back a progress with a bunch of `async await` inside this chain. Aborting is another way to complete a Promise (you cannot leave this Promise pending after aborting), but other client depends on this Promise might need to distinguish whether it's been rejected or be aborted (abort means it cannot be resolved). So there should be an Error when a Promise is aborted, which lead you to catch in case. And the status of this Promise can be described as 'aborted'.
