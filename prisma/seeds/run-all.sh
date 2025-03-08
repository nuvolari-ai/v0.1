#!/bin/bash

bun run seed:chain 
bun run seed:protocol 
bun run seed:token 
bun run seed:pools 
bun run seed:assign-defillama-ids 
bun run seed:assign-protocols-risk 
# bun run seed:assign-gecko-ids