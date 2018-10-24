cd src/sequelize
psql -h localhost -d postgres -U postgres -a -f drop_public.sql
../../node_modules/.bin/sequelize db:migrate
../../node_modules/.bin/sequelize db:seed:all