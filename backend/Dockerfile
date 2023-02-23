FROM ruby:3.1.3-slim

RUN apt-get update -qq -y && apt-get install -y build-essential \
    libpq-dev curl

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs

RUN mkdir -p /backend

WORKDIR /backend

COPY Gemfile* ./

RUN bundle install --jobs 8 --retry 3

COPY . .
