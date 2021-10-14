require 'mina/deploy'
require 'mina/git'

set :domain, '82.84.89.28'
set :user, 'vincent'
set :deploy_to, '/var/www/studium'
set :repository, 'https://vicezone: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@github.com/vicenzone/studium.git'
set :branch, 'master'
set :forward_agent, true
set :keep_releases, 15
set :execution_mode, :pretty

desc "Deploy to all servers"
task :deploy_all do
    fetch(:domains).each do |domain|
      set :domain, domain
      invoke :deploy
    end
end

task :deploy do
  deploy do
    invoke :'git:clone'
    invoke :'npm_install'

    on :launch do
      in_path(fetch(:current_path)) do
         invoke :'deploy:cleanup'
         command %{pm2 delete all -s || true}
         command %{pm2 start app.js}
      end
    end
  end
end

task :npm_install do
  command %{npm install}
end

#task :sequelize_migrations do
#  command %{NODE_TLS_REJECT_UNAUTHORIZED='0' sequelize db:migrate}
#end