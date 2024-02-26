FROM ruby:3.1.3-slim

RUN apt-get update -qq -y && apt-get install -y build-essential \
    libpq-dev curl

RUN set -uex; \
    apt-get update; \
    apt-get install -y ca-certificates curl gnupg; \
    mkdir -p /etc/apt/keyrings; \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
     | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
    NODE_MAJOR=16; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" \
     > /etc/apt/sources.list.d/nodesource.list; \
    apt-get -qy update; \
    apt-get -qy install nodejs;


RUN mkdir -p /backend

WORKDIR /backend

COPY Gemfile* ./
RUN bundle install --jobs 8 --retry 3

#TODO change node to 20 HUB-3-D-T-76
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

# Precompile bootsnap code for faster boot times
RUN rm -rf tmp/cache
RUN bundle exec bootsnap precompile --gemfile app/ lib/
# TODO in rails 7.1 replace with SECRET_KEY_BASE_DUMMY=1
# https://stackoverflow.com/questions/76157925/rails-7-validate-secret-key-base-missing-secret-key-base-for-production-e/76190212
RUN RAILS_ENV=production  SECRET_KEY_BASE=DUMMY bundle exec rails assets:precompile
