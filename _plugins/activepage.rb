# Output CSS class active if current URL matches link URL

module JekyllBootstrapActivePage
  class ActivePageTag < Liquid::Tag
      def initialize(tag_name, text, tokens)
          super
          @text = text
      end

      def render(context)
          name = context.environments.first["page"]["url"]
          return '' if name.nil? or @text.nil?
          return name.start_with?(@text.strip) ? 'active' : ''
      end
  end
end

Liquid::Template.register_tag('active_page', JekyllBootstrapActivePage::ActivePageTag)