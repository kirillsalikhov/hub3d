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

COPY package.json package-lock.json .npmrc wg-industrial-app-8.0.17-*.tgz ./
RUN npm ci

COPY . .

RUN RAILS_ENV=production bundle exec rails assets:precompile
